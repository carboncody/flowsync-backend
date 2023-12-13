import { UserPipe } from './user.pipe';
import { User as UserDecorator } from './user.decorator';
import { User as PrismaUser } from '@prisma/client';

export type EnrichedUserType = PrismaUser & {
  workspaces: {
    workspaceId: string;
  }[];
};

export const EnrichedUser = UserDecorator(UserPipe);
