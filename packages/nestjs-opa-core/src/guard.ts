/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OpaService } from './opa.service';
import {
  AUTHORIZE_METADATA_KEY,
  PUBLIC_METADATA_KEY,
  AuthorizeSpec,
  AuthzOptions,
} from './index';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private readonly options: AuthzOptions, private readonly opa: OpaService) {}

  private getMetadata<T>(key: string, ctx: ExecutionContext): T | undefined {
    return (
      Reflect.getMetadata(key, ctx.getHandler()) ??
      Reflect.getMetadata(key, ctx.getClass())
    );
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.getMetadata<boolean>(PUBLIC_METADATA_KEY, ctx);
    if (isPublic) return true;

    const spec = this.getMetadata<AuthorizeSpec>(AUTHORIZE_METADATA_KEY, ctx);
    if (!spec) {
      throw new ForbiddenException();
    }

    const req = ctx.switchToHttp().getRequest();
    try {
      await this.options.verifyJwt(req);
    } catch {
      throw new UnauthorizedException();
    }

    const input = this.options.buildInput(ctx, spec);
    const policyPath = this.options.policyPath ?? 'authz/result';
    const raw = await this.opa.evaluate(policyPath, input, this.options.opaClient);
    const select = this.options.selectDecision ?? ((r: unknown) => ({ allow: !!(r as any)?.allow }));
    const decision = select(raw);
    if (!decision.allow) {
      throw new ForbiddenException();
    }
    return true;
  }
}
