import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    await this.validateUserAccessToTeamSpace(userId, createTaskDto.teamspaceId);
    if (createTaskDto.assignedTo) {
      await this.validateUserExistence(createTaskDto.assignedTo);
    }
    if (createTaskDto.projectId) {
      await this.validateProjectExistence(createTaskDto.projectId);
    }

    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAllInTeamSpace(userId: string, teamspaceId: string) {
    await this.validateUserAccessToTeamSpace(userId, teamspaceId);
    return this.prisma.task.findMany({
      where: { teamspaceId },
    });
  }

  async findAllMyTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { assignedTo: userId },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    await this.validateUserAccessToTeamSpace(userId, task.teamspaceId);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(userId: string, id: string) {
    const task = await this.findOne(id);
    await this.validateUserAccessToTeamSpace(userId, task.teamspaceId);

    await this.prisma.task.delete({ where: { id } });
  }

  private async validateUserAccessToTeamSpace(
    userId: string,
    teamspaceId: string,
  ) {
    const userTeamSpace = await this.prisma.userTeamspace.findFirst({
      where: {
        userId,
        teamspaceId,
      },
    });
    if (!userTeamSpace) {
      throw new UnauthorizedException(
        `User with ID ${userId} does not have access to TeamSpace with ID ${teamspaceId}`,
      );
    }
  }

  private async validateUserExistence(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  private async validateProjectExistence(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
  }
}
