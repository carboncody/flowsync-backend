import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { TeamspaceController } from './teamspace.controller';
import { TeamspaceService } from './teamspace.service';

@Module({
  controllers: [TeamspaceController],
  providers: [TeamspaceService, PrismaService, UserService],
})
export class TeamspaceModule {}
