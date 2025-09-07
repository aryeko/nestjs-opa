import { AuthzOutbox } from '../src/outbox.entity';
import { rowToRelationship, SpiceDbWriterService, Relationship } from '../src/writer.service';

class InMemoryRepo {
  constructor(public rows: AuthzOutbox[]) {}
  async find() {
    return this.rows.filter(r => !r.processedAt);
  }
  async save(rows: AuthzOutbox[]) {
    // No-op since objects are mutated directly
    return rows;
  }
  create(data: Partial<AuthzOutbox>) {
    return Object.assign(new AuthzOutbox(), data);
  }
}

describe('rowToRelationship', () => {
  it('maps outbox row to relationship', () => {
    const row = Object.assign(new AuthzOutbox(), {
      object: 'device:1',
      relation: 'viewer',
      subject: 'user:2',
      operation: 'insert'
    });
    expect(rowToRelationship(row)).toEqual({
      resource: { type: 'device', id: '1' },
      relation: 'viewer',
      subject: { type: 'user', id: '2' },
      operation: 'insert'
    });
  });
});

describe('SpiceDbWriterService', () => {
  it('processes rows on success', async () => {
    const row = Object.assign(new AuthzOutbox(), {
      object: 'device:1',
      relation: 'viewer',
      subject: 'user:2',
      operation: 'insert',
      processedAt: null,
      retryCount: 0
    });
    const repo = new InMemoryRepo([row]);
    const client = { writeRelationships: jest.fn().mockResolvedValue(undefined) };
    const service = new SpiceDbWriterService(repo as any, client as any, 0);
    await service.flush();
    expect(client.writeRelationships).toHaveBeenCalledWith([rowToRelationship(row)]);
    expect(row.processedAt).toBeInstanceOf(Date);
    expect(row.retryCount).toBe(0);
  });

  it('retries on failure', async () => {
    const row = Object.assign(new AuthzOutbox(), {
      object: 'device:1',
      relation: 'viewer',
      subject: 'user:2',
      operation: 'insert',
      processedAt: null,
      retryCount: 0
    });
    const repo = new InMemoryRepo([row]);
    const client = { writeRelationships: jest.fn().mockRejectedValue(new Error('fail')) };
    const service = new SpiceDbWriterService(repo as any, client as any, 0);
    await expect(service.flush()).rejects.toThrow('fail');
    expect(row.processedAt).toBeNull();
    expect(row.retryCount).toBe(1);
  });
});
