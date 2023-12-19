import { Module } from '@nestjs/common';
import { TeamspaceService } from './teamspace.service';

@Module({
  providers: [TeamspaceService],
})
export class TeamspaceModule {}
