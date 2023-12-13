import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnrichedUser, EnrichedUserType } from './enriched.user.decorator';
import { User as PrismaUser } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create() {
    return this.userService.create();
  }

  @Get('me')
  findMe(@EnrichedUser user: EnrichedUserType) {
    return this.userService.findMe(user.id);
  }

  @Get(':id')
  findAllInWorkspace(@Param('id') id: string) {
    return this.userService.findAllInWorkspace(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @EnrichedUser user: EnrichedUserType) {
    return this.userService.findOne(
      id,
      user.workspaces.map((w) => w.workspaceId),
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
