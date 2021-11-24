import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';

export function exceptionFactory(
  errors: ValidationError[]
): UnprocessableEntityException {
  return new UnprocessableEntityException({
    name: 'Validation Error',
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    errors: errors.map(({ constraints, property, value }) => ({
      message: Object.values(constraints),
      path: property,
      value: value,
    })),
  });
}
