import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AppService,
  BasketCheckoutDto,
  BasketItemCreateDto,
  CustomerBasketReadDto,
  ValidationErrorDto,
} from '../application';
import { Identity } from './decorators/identity';

@Controller('v1/basket')
export class AppController {
  constructor(private readonly _appService: AppService) {}

  // GET api/v1/basket
  @Get()
  @ApiOperation({ summary: 'Get customer basket by customerId' })
  @ApiOAuth2([])
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found record',
    type: CustomerBasketReadDto,
  })
  getBasketById(
    @Identity() customerId: string
  ): Promise<CustomerBasketReadDto> {
    return this._appService.getBasketById(customerId);
  }

  // POST api/v1/basket
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Creates/updates customer basket' })
  @ApiOAuth2([])
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created/update record',
    type: CustomerBasketReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  updateBasket(
    @Identity() customerId: string,
    @Body(new ParseArrayPipe({ items: BasketItemCreateDto }))
    basketItemsDto: BasketItemCreateDto[]
  ): Promise<CustomerBasketReadDto> {
    return this._appService.updateBasket(customerId, basketItemsDto);
  }

  // POST api/v1/basket/checkout
  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Checkout customer order' })
  @ApiOAuth2([])
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order checked out',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  checkout(
    @Identity() customerId: string,
    @Body() basketCheckoutDto: BasketCheckoutDto
  ): Promise<void> {
    return this._appService.checkout(customerId, basketCheckoutDto);
  }

  // DELETE api/v1/basket
  @Delete()
  @ApiOperation({ summary: 'Deletes customer basket' })
  @ApiOAuth2([])
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Record deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  deleteBasket(@Identity() customerId: string): Promise<void> {
    return this._appService.deleteBasket(customerId);
  }
}
