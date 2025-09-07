import { ExecutionContext, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthzModule as CoreAuthzModule, AuthzGuard } from '@arye/nestjs-opa-core';
import { verifyJwt } from '../auth/jwt';

@Module({
  imports: [
    CoreAuthzModule.forRoot({
      verifyJwt,
      buildInput: (ctx: ExecutionContext, spec: AuthorizeSpec) => {
        const req = ctx.switchToHttp().getRequest();
        return {
          subject: req.user ?? {},
          endpoint: spec,
          request: { params: req.params, body: req.body },
        };
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthzGuard }],
})
export class AuthzModule {}

interface AuthorizeSpec {
  action: string;
  [key: string]: unknown;
}
