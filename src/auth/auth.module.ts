import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ENVIRONMENT_KEY } from 'src/env/env.decorator';
import { createEnvironment } from 'src/env/env.factory';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

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
