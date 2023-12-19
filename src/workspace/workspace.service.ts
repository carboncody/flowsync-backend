import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}
  create(createWorkspaceDto: CreateWorkspaceDto) {
    return 'This action adds a new workspace';
  }

  findAll() {
    return `This action returns all workspace`;
  }

  async findOne(urlSlug: string, userWorkspacesUrls: string[]) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        urlSlug,
      },
      include: { members: true, teamSpaces: true, projects: true },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace ${urlSlug} not found`);
    }
    if (!userWorkspacesUrls.includes(workspace.urlSlug)) {
      throw new ForbiddenException(`You don't have access to this workspace`);
    }
    return workspace;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
