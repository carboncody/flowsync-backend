import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  findByEmail(email: string): Promise<PrismaUser> {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        workspaces: true,
      },
    });
  }

  create() {
    return 'This action adds a new user';
  }

  findMe(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        assignedTasks: true,
        workspaces: {
          include: {
            workspace: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findAllInWorkspace(workspaceId: string) {
    return this.prisma.user.findMany({
      where: {
        workspaces: {
          some: {
            workspaceId,
          },
        },
      },
      include: {
        assignedTasks: true,
      },
    });
  }

  async findOne(id: string, workspaceIds: string[]) {
    const transactionResults = await this.prisma.$transaction([
      this.prisma.user.findFirstOrThrow({
        where: {
          id,
          workspaces: {
            some: {
              workspaceId: {
                in: workspaceIds,
              },
            },
          },
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          assignedTasks: true,
        },
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (transactionResults.length !== 2) {
      throw new Error('findEmployeeById - transaction result length incorrect');
    }

    return transactionResults[1];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
