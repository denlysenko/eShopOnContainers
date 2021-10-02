export const DEFAULT_PAGE_SIZE = 10;
export const RBMQ_MESSAGE_BUS_CLIENT = Symbol('RBMQ_MESSAGE_BUS_CLIENT');
export const APP_LOGGER = Symbol('APP_LOGGER');

export enum MessageStatus {
  PENDING = 'pending',
  FAILED = 'failed',
}
