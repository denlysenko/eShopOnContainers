import { Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

@Catch(EntityNotFoundException)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundException) {
    throw new NotFoundException(exception.message);
  }
}
