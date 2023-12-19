import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createTask: CreateTaskDto,
    workspaceIds: string[],
  ) {
    const transactionResults = await this.prisma.$transaction([
      this.prisma.user.findFirstOrThrow({
        where: {
          id: userId,
          workspaces: {
            some: {
              workspaceId: {
                in: workspaceIds,
              },
            },
          },
        },
      }),
      this.prisma.task.create({
        data: {
          teamspaceId: createTask.teamspaceId,
          title: createTask.title,
          description: createTask.description,
          status: createTask.status,
          projectId: createTask.projectId && createTask.projectId,
          assignedTo: createTask.assignedTo && createTask.assignedTo,
          dueDate: createTask.dueDate && createTask.dueDate,
          priority: createTask.priority && createTask.priority,
        },
      }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (transactionResults.length !== 2) {
      throw new Error('findEmployeeById - transaction result length incorrect');
    }

    return transactionResults[1];
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async updateStatus(userId: string, id: string, status: TaskStatus) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.user.findFirstOrThrow({
        where: {
          id: userId,
          teamspaces: {
            some: {
              teamspace: {
                tasks: {
                  some: {
                    id,
                  },
                },
              },
            },
          },
        },
      });

      return await prisma.task.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
    });
  }
}
