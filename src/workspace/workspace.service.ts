import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createWorkspaceDto: CreateWorkspaceDto) {
    return await this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        urlSlug: createWorkspaceDto.urlSlug,
        description: createWorkspaceDto.description,
      },
    });
  }

  async findAllWorkspacesForUser(userId: string) {
    return await this.prisma.userWorkspace
      .findMany({
        where: {
          userId: userId,
        },
        include: {
          workspace: true,
        },
      })
      .then((userWorkspaces) => userWorkspaces.map((uw) => uw.workspace));
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: id,
      },
      include: {
        members: {
          where: {
            userId: userId,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    if (workspace.members.length === 0) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of Workspace with ID ${id}`,
      );
    }

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const userWorkspace = await this.prisma.userWorkspace.findFirst({
      where: {
        workspaceId: id,
        userId: userId,
      },
    });

    if (!userWorkspace) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of Workspace with ID ${id}`,
      );
    }

    if (userWorkspace.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        `User with ID ${userId} does not have permission to update Workspace with ID ${id}`,
      );
    }

    return await this.prisma.workspace.update({
      where: { id: id },
      data: updateWorkspaceDto,
    });
  }

  remove(id: string) {
    throw new Error('TODO : soft delete');
  }
}
