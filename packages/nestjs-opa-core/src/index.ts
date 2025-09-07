import type { AuthorizeSpec } from './decorators';
export { Authorize, Public, AUTHORIZE_METADATA_KEY, PUBLIC_METADATA_KEY, type AuthorizeSpec } from './decorators';
export { AuthzModule } from './module';
export { AuthzGuard } from './guard';
export { OpaService } from './opa.service';

export type OpaInput<TSub = unknown, TEnd = unknown, TReq = unknown> = {
  subject: TSub;
  endpoint: TEnd;
  request: TReq;
};

export type OpaDecision<TExtra = unknown> = { allow: boolean } & TExtra;

export type AuthzOptions<
  TSub = unknown,
  TEnd = unknown,
  TReq = unknown,
  TDecExtra = unknown
> = {
  policyPath?: string;
  buildInput: (ctx: import('@nestjs/common').ExecutionContext, spec: AuthorizeSpec) => OpaInput<TSub, TEnd, TReq>;
  selectDecision?: (raw: unknown) => OpaDecision<TDecExtra>;
  resolveResourceId?: (req: unknown, spec: AuthorizeSpec) => string | undefined;
  verifyJwt: (req: unknown) => Promise<{ sub: string; roles?: string[]; [k: string]: unknown }>;
  opaClient?: { url: string; headers?: Record<string, string>; timeoutMs?: number };
};
