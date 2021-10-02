export interface UnitOfWork {
  // start(): void;
  withTransaction(work: () => Promise<void>): Promise<void>;
}
