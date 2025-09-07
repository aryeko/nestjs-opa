import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { AuthzOutbox } from './outbox.entity';

export interface Relationship {
  resource: { type: string; id: string };
  relation: string;
  subject: { type: string; id: string };
  operation: 'insert' | 'delete';
}

export interface SpiceDbClient {
  writeRelationships(rels: Relationship[]): Promise<void>;
}

export function rowToRelationship(row: AuthzOutbox): Relationship {
  const [resType, resId] = row.object.split(':');
  const [subType, subId] = row.subject.split(':');
  return {
    resource: { type: resType, id: resId },
    relation: row.relation,
    subject: { type: subType, id: subId },
    operation: row.operation,
  };
}

@Injectable()
export class SpiceDbWriterService implements OnModuleInit, OnModuleDestroy {
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly repo: Repository<AuthzOutbox>,
    private readonly client: SpiceDbClient,
    private readonly intervalMs: number = parseInt(process.env.AUTHZ_WRITER_INTERVAL_MS ?? '10000', 10),
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      this.flush().catch(() => undefined);
    }, this.intervalMs);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async flush(): Promise<void> {
    const rows = await this.repo.find({ where: { processedAt: IsNull() } });
    if (!rows.length) return;
    try {
      await this.client.writeRelationships(rows.map(rowToRelationship));
      const now = new Date();
      for (const row of rows) {
        row.processedAt = now;
      }
      await this.repo.save(rows);
    } catch (err) {
      for (const row of rows) {
        row.retryCount += 1;
      }
      await this.repo.save(rows);
      throw err;
    }
  }
}
