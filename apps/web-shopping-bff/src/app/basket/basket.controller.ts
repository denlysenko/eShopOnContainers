import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOAuth2,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { exceptionFactory } from '../../exception.factory';
import { AuthGuard } from '../common';
import { BasketService } from './basket.service';
import { BasketCheckoutDto } from './dto/basket-checkout.dto';
import { BasketItemCreateDto } from './dto/basket-item-create.dto';
import { BasketReadDto } from './dto/basket-read.dto';
import { ValidationErrorDto } from './dto/validation-error.dto';

@Controller('v1/basket')
@UseGuards(AuthGuard)
@ApiTags('Customer Basket')
export class BasketController {
  constructor(private readonly _basketService: BasketService) {}

  // GET api/v1/basket
  @Get()
  @ApiOperation({ summary: 'Get customer basket by customerId' })
  @ApiOAuth2([])
  @ApiHeader({
    name: 'Authorization',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found record',
    type: BasketReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication Error',
  })
  getCustomerBasket(
    @Headers('Authorization') token: string
  ): Promise<BasketReadDto> {
    return this._basketService.getCustomerBasket(token);
  }

  // POST api/v1/basket
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Creates/updates customer basket' })
  @ApiOAuth2([])
  @ApiHeader({
    name: 'Authorization',
    required: false,
  })
  @ApiBody({
    type: BasketItemCreateDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created/updated record',
    type: BasketReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  updateBasket(
    @Headers('Authorization') token: string,
    @Body(new ParseArrayPipe({ items: BasketItemCreateDto, exceptionFactory }))
    basketItemsDto: BasketItemCreateDto[]
  ): Promise<BasketReadDto> {
    return this._basketService.updateBasket(token, basketItemsDto);
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  checkout(
    @Headers('Authorization') token: string,
    @Body() basketCheckoutDto: BasketCheckoutDto
  ): Promise<void> {
    return this._basketService.checkout(token, basketCheckoutDto);
  }
}
