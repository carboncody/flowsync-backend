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
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Post(':workspaceId/users/:userId')
  addUserToWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Param('userId') userId: string,
    @EnrichedUser user: User,
  ) {
    return this.workspaceService.addUserToWorkspace(
      user.id,
      userId,
      workspaceId,
    );
  }

  @Get()
  findAllWorkspacesForUser(@EnrichedUser user: User) {
    return this.workspaceService.findAllWorkspacesForUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @EnrichedUser user: User) {
    return this.workspaceService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @EnrichedUser user: User,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, user.id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
