import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOAuth2,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../common';
import { BasketService } from './basket.service';
import { BasketReadDto } from './dto/basket-read.dto';

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
}
