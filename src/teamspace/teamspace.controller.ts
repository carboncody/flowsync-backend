import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { EnrichedUser } from 'src/user/enriched.user.decorator';
import { CreateteamspaceDto } from './dto/create-teamspace.dto';
import { UpdateteamspaceDto } from './dto/update-teamspace.dto';
import { TeamspaceService } from './teamspace.service';

@Controller('teamspace')
export class TeamspaceController {
  constructor(private readonly teamspaceService: TeamspaceService) {}

  @Post(':workspaceId')
  create(
    @Param('workspaceId') workspaceId: string,
    @EnrichedUser user: User,
    @Body() createteamspaceDto: CreateteamspaceDto,
  ) {
    return this.teamspaceService.create(
      workspaceId,
      user.id,
      createteamspaceDto,
    );
  }

  @Post(':teamspaceId/users/:userId')
  addUserToTeamSpace(
    @Param('teamspaceId') teamspaceId: string,
    @Param('userId') userId: string,
    @EnrichedUser user: User,
  ) {
    return this.teamspaceService.addUserToTeamSpace(
      userId,
      teamspaceId,
      user.id,
    );
  }

  @Get('workspace/:workspaceId')
  findAllInWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.teamspaceService.findAllInWorkspace(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamspaceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @EnrichedUser user: User,
    @Body() updateteamspaceDto: UpdateteamspaceDto,
  ) {
    return this.teamspaceService.update(id, user.id, updateteamspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @EnrichedUser user: User) {
    return this.teamspaceService.remove(id, user.id);
  }
}
