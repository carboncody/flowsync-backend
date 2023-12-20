import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  teamspaceId: string;
  projectId?: string;
}
