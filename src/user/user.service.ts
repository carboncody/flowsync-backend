import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Env } from 'src/env/env.decorator';
import { Environment } from 'src/env/env.factory';
import { ContentType } from 'lib/constants';
import { UserEntity } from './entities/user.entity';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
}

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    @Env private env: Environment,
  ) {}
  findByEmail(email: string) {
    return this.prismaService.user.findUniqueOrThrow({ where: { email } });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.prismaService.user.findMany();
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
