import { Controller, Get } from '@nestjs/common';
import { Authorize, Public } from '@arye/nestjs-opa-core';

@Controller()
export class AppController {
  @Get('ping')
  @Public()
  ping() {
    return 'pong';
  }

  @Get('secret')
  @Authorize({ action: 'read.secret' })
  secret() {
    return 'shh';
  }
}
