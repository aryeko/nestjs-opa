import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { AuthzOutbox, AuthzOperation } from '../outbox.entity';

export interface AuthzTuple {
  object: string;
  relation: string;
  subject: string;
}

export interface AuthzTuplable {
  authzTuples(): AuthzTuple[];
}

@EventSubscriber()
export class AuthzOutboxSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Object;
  }

  async afterInsert(event: InsertEvent<unknown>) {
    await this.enqueue(event.manager, event.entity as unknown, 'insert');
  }

  async afterRemove(event: RemoveEvent<unknown>) {
    const entity = (event.entity ?? event.databaseEntity) as unknown;
    await this.enqueue(event.manager, entity, 'delete');
  }

  private async enqueue(
    manager: InsertEvent<unknown>['manager'],
    entity: unknown,
    op: AuthzOperation,
  ) {
    const tuplable = entity as AuthzTuplable;
    if (!tuplable || typeof tuplable.authzTuples !== 'function') return;
    const repo = manager.getRepository(AuthzOutbox);
    for (const t of tuplable.authzTuples()) {
      const row = repo.create({ ...t, operation: op });
      await repo.save(row);
    }
  }
}
