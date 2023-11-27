import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Env } from 'src/env/env.decorator';
import { Environment } from 'src/env/env.factory';
import { UserEntity } from 'src/user/entities/user.entity';
import { IS_PUBLIC_KEY } from 'src/public/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Env private env: Environment,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    try {
      const request = context
        .switchToHttp()
        .getRequest<Request & { user: UserEntity }>();
      const token = this.extractToken(request);

      const user = await this.verifyToken(token);

      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private isPublic(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractToken(request: Request) {
    try {
      return this.extractTokenFromCookie(request);
    } catch {
      // Swallows error message
      return this.extractTokenFromAuthorization(request);
    }
  }

  private extractTokenFromCookie(request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = request.cookies?.token as string | undefined;

    if (!token) {
      throw new ForbiddenException('No token cookie included in request');
    }

    return token;
  }

  private extractTokenFromAuthorization(request: Request) {
    const authorization = request.headers.authorization;
    const forbiddenException = new ForbiddenException(
      'No bearer authorization header included in request',
    );

    if (!authorization) {
      throw forbiddenException;
    }

    if (!authorization.startsWith('Bearer ')) {
      throw forbiddenException;
    }

    const [, token] = authorization.split('Bearer ');
    return token;
  }

  private async verifyToken(token: string) {
    const uncheckedUser = await this.jwtService.verifyAsync<UserEntity>(token, {
      publicKey: this.env.auth0.publicCertificate,
    });

    if (typeof uncheckedUser === 'string') {
      throw new Error();
    }

    const result = UserEntity.safeParse(uncheckedUser);
    if (!result.success) {
      throw new Error();
    }

    const user = result.data;
    if (new Date().getTime() > user.exp * 1000) {
      throw new Error();
    }

    return user;
  }
}
