import { ILogger } from '@e-shop-on-containers/logger';

export const loggerMock: ILogger = {
  debug: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
};
