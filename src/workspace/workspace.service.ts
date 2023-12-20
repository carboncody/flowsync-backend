import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: createWorkspaceDto,
    });
  }

  async addUserToWorkspace(
    requestorId: string,
    userIdToAdd: string,
    workspaceId: string,
  ) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const requestorWorkspace = await prisma.userWorkspace.findFirst({
          where: {
            userId: requestorId,
            workspaceId: workspaceId,
          },
        });

        if (!requestorWorkspace) {
          throw new ForbiddenException(
            `User with ID ${requestorId} is not a member of Workspace with ID ${workspaceId}`,
          );
        }

        const existingAssociation = await prisma.userWorkspace.findFirst({
          where: {
            userId: userIdToAdd,
            workspaceId,
          },
        });

        if (existingAssociation) {
          throw new ForbiddenException(
            'User is already a member of the workspace.',
          );
        }

        return await prisma.userWorkspace.create({
          data: {
            userId: userIdToAdd,
            workspaceId,
            userName: 'User',
          },
        });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
      }
      throw error;
    }
  }

  async findAllWorkspacesForUser(userId: string) {
    return this.prisma.userWorkspace
      .findMany({
        where: {
          userId,
        },
        include: {
          workspace: true,
        },
      })
      .then((userWorkspaces) => userWorkspaces.map((uw) => uw.workspace));
  }

  async findOne(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: {
          where: {
            userId,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    if (workspace.members.length === 0) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of Workspace with ID ${workspaceId}`,
      );
    }

    return workspace;
  }

  async update(
    workspaceId: string,
    userId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const userWorkspace = await this.prisma.userWorkspace.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!userWorkspace) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of Workspace with ID ${workspaceId}`,
      );
    }

    if (userWorkspace.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `User with ID ${userId} does not have permission to update Workspace with ID ${workspaceId}`,
      );
    }

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: updateWorkspaceDto,
    });
  }

  async remove(workspaceId: string) {
    // Implement logic for soft delete if necessary
    // For now, it's a simple delete operation
    return this.prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }
}
