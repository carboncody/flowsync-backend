import { UserStatus } from '@prisma/client';

export class CreateUserDto {
  email: string;
  profilePicture?: string;
  status?: UserStatus;
}
