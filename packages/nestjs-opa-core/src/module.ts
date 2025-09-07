import { DynamicModule, Module } from '@nestjs/common';
import { AuthzGuard } from './guard';
import { OpaService } from './opa.service';
import type { AuthzOptions } from './index';

@Module({})
export class AuthzModule {
  static forRoot(options: AuthzOptions): DynamicModule {
    return {
      module: AuthzModule,
      providers: [
        OpaService,
        {
          provide: AuthzGuard,
          useFactory: (opa: OpaService) => new AuthzGuard(options, opa),
          inject: [OpaService],
        },
      ],
      exports: [AuthzGuard, OpaService],
    };
  }
}
