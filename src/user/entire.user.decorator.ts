import { UserPipe } from './user.pipe';
import { User } from './user.decorator';

export const EntireUser = User(UserPipe);
