import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnrichedUser } from './enriched.user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto, @EnrichedUser user: User) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @EnrichedUser user: User,
  ) {
    return this.userService.update(userId, updateUserDto);
  }
}
