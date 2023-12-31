import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ENVIRONMENT_KEY } from './env/env.decorator';
import { createEnvironment } from './env/env.factory';
import { PrismaService } from './prisma.service';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TeamspaceModule } from './teamspace/teamspace.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProjectModule,
    TaskModule,
    UserModule,
    WorkspaceModule,
    AuthModule,
    TeamspaceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      // Used by @Env decorator
      provide: ENVIRONMENT_KEY,
      useFactory: createEnvironment,
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
