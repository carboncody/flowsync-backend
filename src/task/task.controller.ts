import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { EnrichedUser } from 'src/user/enriched.user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@EnrichedUser user: User, @Body() createTaskDto: CreateTaskDto) {
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.create(user.id, createTaskDto);
  }

  @Get('team-space/:teamspaceId')
  findAllInTeamSpace(
    @EnrichedUser user: User,
    @Param('teamspaceId') teamspaceId: string,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.findAllInTeamSpace(user.id, teamspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(
    @EnrichedUser user: User,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.update(user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@EnrichedUser user: User, @Param('id') id: string) {
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }
    return this.taskService.remove(user.id, id);
  }
}
