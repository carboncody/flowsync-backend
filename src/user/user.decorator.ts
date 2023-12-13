import { Request } from 'express';
import { User as PrismaUser } from '@prisma/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: PrismaUser;
}

export const User = createParamDecorator(
  (data: keyof PrismaUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;
    return data ? user[data] : user;
  },
);
