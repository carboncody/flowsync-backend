import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description?: string;
  statusId?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  teamspaceId: string;
  projectId?: string;
}
