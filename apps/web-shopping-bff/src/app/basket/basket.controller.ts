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
}
