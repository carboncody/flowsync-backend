import { Injectable, PipeTransform } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserPipe
  implements PipeTransform<UserEntity, Promise<PrismaUser>>
{
  constructor(private userService: UserService) {}

  transform({ email }: UserEntity): Promise<PrismaUser> {
    return this.userService.findByEmail(email);
  }
}
