import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm';
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

  async afterInsert(event: InsertEvent<any>) {
    await this.enqueue(event.manager, event.entity, 'insert');
  }

  async afterRemove(event: RemoveEvent<any>) {
    const entity = event.entity ?? event.databaseEntity;
    await this.enqueue(event.manager, entity, 'delete');
  }

  private async enqueue(manager: InsertEvent<any>['manager'], entity: any, op: AuthzOperation) {
    if (!entity || typeof entity.authzTuples !== 'function') return;
    const repo = manager.getRepository(AuthzOutbox);
    for (const t of entity.authzTuples() as AuthzTuple[]) {
      const row = repo.create({ ...t, operation: op });
      await repo.save(row);
    }
  }
}
