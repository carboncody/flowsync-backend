import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        workspaces: {
          include: {
            workspace: {},
          },
        },
      },
    });
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }
}
