import { SetMetadata } from '@nestjs/common';

export interface AuthorizeSpec {
  action: string;
  resourceType?: string;
  resourceIdParam?: string;
  unauthenticated?: false;
}

export const AUTHORIZE_METADATA_KEY = 'arye:nestjs-opa-core:authorize';
export const PUBLIC_METADATA_KEY = 'arye:nestjs-opa-core:public';

export const Authorize = (spec: AuthorizeSpec) => SetMetadata(AUTHORIZE_METADATA_KEY, spec);
export const Public = () => SetMetadata(PUBLIC_METADATA_KEY, true);
