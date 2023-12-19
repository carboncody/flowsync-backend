import { User as PrismaUser, Workspace } from '@prisma/client';
import { User as UserDecorator } from './user.decorator';
import { UserPipe } from './user.pipe';

export type EnrichedUserType = PrismaUser & {
  workspaces: {
    workspace: Workspace;
  }[];
};

export const EnrichedUser = UserDecorator(UserPipe);
