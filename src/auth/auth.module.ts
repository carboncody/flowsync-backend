import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_KEY } from 'src/env/env.decorator';
import { createEnvironment } from 'src/env/env.factory';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule, HttpModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PrismaService,
    AuthService,
    {
      // Used by @Env decorator
      provide: ENVIRONMENT_KEY,
      useFactory: createEnvironment,
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
