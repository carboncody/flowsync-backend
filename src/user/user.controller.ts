import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnrichedUser } from './enriched.user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto, @EnrichedUser user: User) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  findMe(@EnrichedUser user: User) {
    return this.userService.findMe(user.id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }
}
