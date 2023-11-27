import { Inject } from '@nestjs/common';

export const ENVIRONMENT_KEY = '@ENVIRONMENT_KEY' as const;
export const Env = Inject(ENVIRONMENT_KEY);
