export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): number;
}
