import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { Request } from 'express';

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
