import 'reflect-metadata';
import {
  Authorize,
  Public,
  AUTHORIZE_METADATA_KEY,
  PUBLIC_METADATA_KEY,
} from '../src/decorators';
import { AuthzGuard } from '../src/guard';
import type { AuthzOptions } from '../src';

class MockOpa {
  evaluate = jest.fn();
}

function createContext(handler: Function, req: any = {}) {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => handler,
    getClass: () => handler.constructor,
  } as any;
}

describe('decorators', () => {
  it('stores metadata', () => {
    const spec = { action: 'test' } as const;
    class T {
      fn() {}
      pub() {}
    }
    Authorize(spec)(T.prototype, 'fn', Object.getOwnPropertyDescriptor(T.prototype, 'fn')!);
    Public()(T.prototype, 'pub', Object.getOwnPropertyDescriptor(T.prototype, 'pub')!);
    const authorizeMeta = Reflect.getMetadata(
      AUTHORIZE_METADATA_KEY,
      T.prototype.fn
    );
    const publicMeta = Reflect.getMetadata(
      PUBLIC_METADATA_KEY,
      T.prototype.pub
    );
    expect(authorizeMeta).toEqual(spec);
    expect(publicMeta).toBe(true);
  });
});

describe('AuthzGuard', () => {
  const baseOptions: AuthzOptions = {
    buildInput: () => ({ subject: {}, endpoint: {}, request: {} }),
    verifyJwt: async () => ({ sub: 'u1' }),
  };

  it('allows public route without JWT', async () => {
    class C {
      handler() {}
    }
    Public()(C.prototype, 'handler', Object.getOwnPropertyDescriptor(C.prototype, 'handler')!);
    const guard = new AuthzGuard(baseOptions, new MockOpa() as any);
    const ctx = createContext(C.prototype.handler);
    await expect(guard.canActivate(ctx as any)).resolves.toBe(true);
  });

  it('allows when decision is allow', async () => {
    class C {
      handler() {}
    }
    Authorize({ action: 'a' })(C.prototype, 'handler', Object.getOwnPropertyDescriptor(C.prototype, 'handler')!);
    const opa = new MockOpa();
    opa.evaluate.mockResolvedValue({ allow: true });
    const guard = new AuthzGuard(baseOptions, opa as any);
    const ctx = createContext(C.prototype.handler);
    await expect(guard.canActivate(ctx as any)).resolves.toBe(true);
    expect(opa.evaluate).toHaveBeenCalled();
  });

  it('denies when decision is deny', async () => {
    class C {
      handler() {}
    }
    Authorize({ action: 'a' })(C.prototype, 'handler', Object.getOwnPropertyDescriptor(C.prototype, 'handler')!);
    const opa = new MockOpa();
    opa.evaluate.mockResolvedValue({ allow: false });
    const guard = new AuthzGuard(baseOptions, opa as any);
    const ctx = createContext(C.prototype.handler);
    await expect(guard.canActivate(ctx as any)).rejects.toThrowError();
  });

  it('denies when decorator missing', async () => {
    class C {
      handler() {}
    }
    const guard = new AuthzGuard(baseOptions, new MockOpa() as any);
    const ctx = createContext(C.prototype.handler);
    await expect(guard.canActivate(ctx as any)).rejects.toThrowError();
  });
});
