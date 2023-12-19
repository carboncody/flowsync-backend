import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole, teamspace } from '@prisma/client';
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
  ): Promise<teamspace> {
    const userWorkspace = await this.prisma.userWorkspace.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: userId,
      },
    });

    if (!userWorkspace || userWorkspace.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        `User with ID ${userId} does not have permission to create a teamspace in Workspace with ID ${workspaceId}`,
      );
    }

    return await this.prisma.teamspace.create({
      data: {
        ...createteamspaceDto,
        workspaceId: workspaceId,
      },
    });
  }

  async findAllInWorkspace(workspaceId: string): Promise<teamspace[]> {
    return await this.prisma.teamspace.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        tasks: true, // Include tasks in the response
      },
    });
  }

  async findOne(id: string): Promise<teamspace> {
    const teamspace = await this.prisma.teamspace.findUnique({
      where: {
        id: id,
      },
      include: {
        tasks: true, // Include tasks in the response
      },
    });

    if (!teamspace) {
      throw new NotFoundException(`teamspace with ID ${id} not found`);
    }

    return teamspace;
  }

  async update(
    id: string,
    userId: string,
    updateteamspaceDto: UpdateteamspaceDto,
  ): Promise<teamspace> {
    // Ensure that the user has the right to update the teamspace
    // This example assumes that the user must be a member of the teamspace with an Admin role
    const userteamspace = await this.prisma.userteamspace.findFirst({
      where: {
        teamspaceId: id,
        userId: userId,
      },
    });

    if (!userteamspace || userteamspace.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        `User with ID ${userId} does not have permission to update teamspace with ID ${id}`,
      );
    }

    return await this.prisma.teamspace.update({
      where: { id: id },
      data: updateteamspaceDto,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if the user has permission to delete the teamspace
    const userteamspace = await this.prisma.userteamspace.findFirst({
      where: {
        teamspaceId: id,
        userId: userId,
      },
    });

    if (!userteamspace || userteamspace.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        `User with ID ${userId} does not have permission to delete teamspace with ID ${id}`,
      );
    }

    await this.prisma.teamspace.delete({
      where: { id: id },
    });
  }
}
