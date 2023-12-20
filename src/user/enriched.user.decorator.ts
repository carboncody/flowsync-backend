import { User as UserDecorator } from './user.decorator';
import { UserPipe } from './user.pipe';

export const EnrichedUser = UserDecorator(UserPipe);
