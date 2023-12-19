import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_KEY } from 'src/env/env.decorator';
import { createEnvironment } from 'src/env/env.factory';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    {
      // Used by @Env decorator
      provide: ENVIRONMENT_KEY,
      useFactory: createEnvironment,
      inject: [ConfigService],
    },
  ],
})
export class UserModule {}
