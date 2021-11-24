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
import { CardTypeReadDto } from './dto/card-type-read.dto';
import { OrdersService } from './orders.service';

@Controller('v1/orders')
@UseGuards(AuthGuard)
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly _ordersService: OrdersService) {}

  // GET api/v1/orders/card-types
  @Get('card-types')
  @ApiOperation({ summary: 'Get card types' })
  @ApiOAuth2([])
  @ApiHeader({
    name: 'Authorization',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CardTypeReadDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization Error',
  })
  getCardTypes(
    @Headers('Authorization') token: string
  ): Promise<CardTypeReadDto[]> {
    return this._ordersService.getCardTypes(token);
  }
}
