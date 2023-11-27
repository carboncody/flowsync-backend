import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { Injectable, PipeTransform } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserPipe implements PipeTransform<UserEntity, Promise<User>> {
  constructor(private userService: UserService) {}

  transform({ email }: UserEntity) {
    return this.userService.findByEmail(email);
  }
}
