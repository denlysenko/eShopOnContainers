import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class ErrorItem {
  @ApiProperty()
  readonly message: string[];

  @ApiProperty()
  readonly path: string;
}

export class ValidationErrorDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ default: HttpStatus.UNPROCESSABLE_ENTITY })
  readonly status: number;

  @ApiProperty({ type: ErrorItem, isArray: true })
  readonly errors: ErrorItem[];
}
