export interface UnitOfWork {
  withTransaction(work: () => Promise<void>): Promise<void>;
}
