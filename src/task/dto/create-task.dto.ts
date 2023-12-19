import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description?: string;
  teamspaceId: string;
  status?: TaskStatus;
  projectId?: string;
  assignedTo?: string;
  dueDate?: Date;
  priority?: TaskPriority;
}
