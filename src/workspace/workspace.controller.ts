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

  @Get()
  findAllWorkspacesForUser(@EnrichedUser user: EnrichedUserType) {
    return this.workspaceService.findAllWorkspacesForUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @EnrichedUser user: EnrichedUserType) {
    return this.workspaceService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @EnrichedUser user: EnrichedUserType,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, user.id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
