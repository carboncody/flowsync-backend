import { presetTaskStatuses } from '@constants/presetTaskStatuses';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, UserTeamspace } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateteamspaceDto } from './dto/create-teamspace.dto';
import { UpdateteamspaceDto } from './dto/update-teamspace.dto';

@Injectable()
export class TeamspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    userId: string,
    createteamspaceDto: CreateteamspaceDto,
  ) {
    const userWorkspace = await this.prisma.userWorkspace.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: userId,
      },
    });

    if (!userWorkspace || userWorkspace.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `User with ID ${userId} does not have permission to create a teamspace in Workspace with ID ${workspaceId}`,
      );
    }

    return this.prisma.teamspace.create({
      data: {
        ...createteamspaceDto,
        workspaceId: workspaceId,
        taskStatuses: {
          createMany: {
            data: presetTaskStatuses,
          },
        },
      },
    });
  }

  async addUserToTeamSpace(
    userIdToAdd: string,
    teamspaceId: string,
    requestorId: string,
  ): Promise<UserTeamspace> {
    const requestorTeamSpace = await this.prisma.userTeamspace.findFirst({
      where: {
        teamspaceId,
        userId: requestorId,
      },
    });

    if (!requestorTeamSpace || requestorTeamSpace.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `User with ID ${requestorId} does not have admin permission in TeamSpace with ID ${teamspaceId}`,
      );
    }

    return this.prisma.userTeamspace.create({
      data: {
        userId: userIdToAdd,
        teamspaceId,
        role: UserRole.BASIC, // Example default role
      },
    });
  }

  async findAllInWorkspace(workspaceId: string) {
    return this.prisma.teamspace.findMany({
      where: { workspaceId },
      include: { tasks: true },
    });
  }

  async findOne(id: string) {
    const teamspace = await this.prisma.teamspace.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!teamspace) {
      throw new NotFoundException(`TeamSpace with ID ${id} not found`);
    }

    return teamspace;
  }

  async update(
    id: string,
    userId: string,
    updateteamspaceDto: UpdateteamspaceDto,
  ) {
    const userteamspace = await this.prisma.userTeamspace.findFirst({
      where: {
        teamspaceId: id,
        userId: userId,
      },
    });

    if (!userteamspace || userteamspace.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `User with ID ${userId} does not have permission to update TeamSpace with ID ${id}`,
      );
    }

    return this.prisma.teamspace.update({
      where: { id },
      data: updateteamspaceDto,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const userteamspace = await this.prisma.userTeamspace.findFirst({
      where: {
        teamspaceId: id,
        userId: userId,
      },
    });

    if (!userteamspace || userteamspace.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `User with ID ${userId} does not have permission to delete TeamSpace with ID ${id}`,
      );
    }

    await this.prisma.teamspace.delete({ where: { id } });
  }
}
