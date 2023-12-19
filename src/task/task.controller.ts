import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import {
  EnrichedUser,
  EnrichedUserType,
} from 'src/user/enriched.user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @EnrichedUser user: EnrichedUserType,
  ) {
    return this.taskService.create(
      user.id,
      createTaskDto,
      user.workspaces.map((w) => w.workspace.id),
    );
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Patch(':id/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
    @EnrichedUser user: EnrichedUserType,
  ) {
    if (!(status in TaskStatus)) {
      throw new BadRequestException('Invalid task status');
    }

    return this.taskService.updateStatus(user.id, id, status as TaskStatus);
  }
}
