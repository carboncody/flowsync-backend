import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import type { Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ContentType } from 'lib/constants';
import { firstValueFrom } from 'rxjs';
import { Env } from 'src/env/env.decorator';
import { Environment } from 'src/env/env.factory';
import { PrismaService } from 'src/prisma.service';
import { Public } from 'src/public/public.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    @Env private env: Environment,
  ) {}

  @Public()
  @Get('/login')
  async login(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const auth0BaseUrl = this.env.auth0.issuerBaseUrl;
      const backendUrl = this.env.baseDevUrl;

      const { data } = await firstValueFrom(
        this.httpService.post<TokenResponse>(
          `${auth0BaseUrl}/oauth/token`,
          {
            grant_type: 'authorization_code',
            client_id: this.env.auth0.clientId,
            client_secret: this.env.auth0.clientSecret,
            code,
            redirect_uri: `${backendUrl}/auth/login`,
          },
          {
            headers: {
              'Content-Type': ContentType.ApplicationURLEncoded,
            },
          },
        ),
      );

      const userEntity = this.validateToken(data.id_token);
      const user = await this.registerUserLogin(userEntity);

      if (user.status === UserStatus.INCOMPLETE) {
        return res.redirect(
          this.env.frontendUrl +
            `/token?token=${data.id_token}&exp=${
              userEntity.exp * 1000
            }&redirect=signup`,
        );
      }

      if (user.status === UserStatus.INVITED) {
        return res.redirect(
          this.env.frontendUrl +
            `/token?token=${data.id_token}&exp=${
              userEntity.exp * 1000
            }&redirect=invite`,
        );
      }

      return res.redirect(
        this.env.frontendUrl +
          `/token?token=${data.id_token}&exp=${userEntity.exp * 1000}`,
      );
    } catch (e) {
      return res.json({
        success: false,
        error: e instanceof Error ? e.message : 'unknown error',
      });
    }
  }

  private validateToken(token: string) {
    const userInfo = verify(token, this.env.auth0.publicCertificate);

    if (typeof userInfo === 'string' || !userInfo.exp) {
      throw new Error();
    }

    if (new Date().getTime() > userInfo.exp * 1000) {
      throw new Error();
    }

    const result = UserEntity.safeParse(userInfo);

    if (!result.success) {
      throw new Error();
    }

    return result.data;
  }

  private async registerUserLogin({ email }: { email: string }) {
    // Upsert the user
    let user = await this.prismaService.user.upsert({
      where: { email },
      create: {
        email,
        status: UserStatus.INCOMPLETE,
        lastLogin: new Date(),
      },
      update: {
        lastLogin: new Date(),
        status: UserStatus.COMPLETE,
      },
      include: { workspaces: true },
    });

    const userWorkspaces = await this.prismaService.userWorkspace.findMany({
      where: { userId: user.id },
    });

    // if (userWorkspaces.length === 0) {
    //   const workspace = await this.prismaService.workspace.create({
    //     data: {
    //       name: 'My Workspace',
    //       description: 'Personal workspace for ' + email,
    //       tasks: {
    //         create: [
    //           { title: 'Task 1', status: TaskStatus.TODO },
    //           { title: 'Task 2', status: TaskStatus.IN_PROGRESS },
    //           { title: 'Task 3', status: TaskStatus.REVIEW },
    //           { title: 'Task 4', status: TaskStatus.DONE },
    //         ],
    //       },
    //     },
    //   });

    //   await this.prismaService.userWorkspace.create({
    //     data: {
    //       userId: user.id,
    //       workspaceId: workspace.id,
    //       userName: 'SomeUserName',
    //       role: UserRole.ADMIN,
    //     },
    //   });
    // }

    const updatedUser = await this.prismaService.user.findUnique({
      where: { email },
      include: { workspaces: true },
    });

    if (!updatedUser) {
      throw new Error('User not found after upsert');
    }

    return updatedUser;
  }
}
