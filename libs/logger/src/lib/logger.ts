import { LoggerService } from '@nestjs/common';

export { LoggerService as ILogger };

export const LOGGER = Symbol('ILogger');
