# @arye/nestjs-opa-core

Core helpers to connect NestJS apps to an OPA policy decision point.

## Installation

```bash
pnpm add @arye/nestjs-opa-core
```

## Usage

```ts
import { Authorize, AuthzModule, Public } from '@arye/nestjs-opa-core';

@Controller('cameras')
export class CameraController {
  @Get(':id/stream')
  @Authorize({ action: 'camera.stream' })
  stream() {}

  @Get('status')
  @Public()
  status() {}
}

@Module({
  imports: [
    AuthzModule.forRoot({
      buildInput: () => ({ subject: {}, endpoint: {}, request: {} }),
      verifyJwt: async () => ({ sub: '123' }),
    }),
  ],
})
export class AppModule {}
```
