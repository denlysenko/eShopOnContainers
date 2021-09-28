import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { CatalogDomainException } from '../exceptions/catalog-domain.exception';

@Catch(CatalogDomainException)
export class CatalogDomainExceptionFilter implements ExceptionFilter {
  catch(exception: CatalogDomainException) {
    throw new BadRequestException(exception.message);
  }
}
