/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { OPAClient } from '@styra/opa';

@Injectable()
export class OpaService {
  private client: OPAClient;

  constructor() {
    this.client = new OPAClient('http://localhost:8181');
  }

  async evaluate<TInput = unknown, TResult = unknown>(
    path: string,
    input: TInput,
    clientOpts?: { url: string; headers?: Record<string, string>; timeoutMs?: number }
  ): Promise<TResult> {
    if (clientOpts) {
      const tmp = new OPAClient(clientOpts.url, {
        headers: clientOpts.headers,
        timeout: clientOpts.timeoutMs,
      } as any);
      return tmp.evaluate(path, input as any) as Promise<TResult>;
    }
    return this.client.evaluate(path, input as any) as Promise<TResult>;
  }
}
