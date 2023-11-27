import {
    Controller,
    Get,
    Query,
    Res,
  } from '@nestjs/common';
  import { Public } from 'src/public/public.decorator';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Public()
    @Get('/login')
    async login(
      @Query('code') code: string,
      @Res({ passthrough: true }) res: Response,
    ) {
      return this.authService.login(code, res);
    }
}
