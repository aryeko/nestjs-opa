import { Body, Controller, Post } from '@nestjs/common';
import { signJwt } from './jwt';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body('sub') sub: string) {
    const token = await signJwt({ sub: sub ?? 'user' });
    return { token };
  }
}
