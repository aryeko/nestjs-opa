# @arye/nestjs-spicedb-writer

TypeORM outbox entity, subscribers, and a writer service that periodically syncs relationship deltas to SpiceDB.

## Installation

```bash
pnpm add @arye/nestjs-spicedb-writer
```

## Usage

Entities that wish to emit authorization changes should implement an `authzTuples()` method returning tuples in the form `{object, relation, subject}`. The `AuthzOutboxSubscriber` captures inserts and removals and stores them in the `AuthzOutbox` table. The `SpiceDbWriterService` batches pending rows and invokes a provided client to write relationships to SpiceDB.
