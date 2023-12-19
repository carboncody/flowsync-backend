import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  EnrichedUser,
  EnrichedUserType,
} from 'src/user/enriched.user.decorator';
import { CreateteamspaceDto } from './dto/create-teamspace.dto';
import { UpdateteamspaceDto } from './dto/update-teamspace.dto';
import { TeamspaceService } from './teamspace.service';

@Controller('teamspace')
export class TeamspaceController {
  constructor(private readonly teamspaceService: TeamspaceService) {}

  @Post(':workspaceId')
  create(
    @Param('workspaceId') workspaceId: string,
    @EnrichedUser user: EnrichedUserType,
    @Body() createteamspaceDto: CreateteamspaceDto,
  ) {
    return this.teamspaceService.create(
      workspaceId,
      user.id,
      createteamspaceDto,
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
    @EnrichedUser user: EnrichedUserType,
    @Body() updateteamspaceDto: UpdateteamspaceDto,
  ) {
    return this.teamspaceService.update(id, user.id, updateteamspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @EnrichedUser user: EnrichedUserType) {
    return this.teamspaceService.remove(id, user.id);
  }
}
