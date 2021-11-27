import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { OrderReadDto } from './dto/order-read.dto';
import { OrderSummaryDto } from './dto/order-summary.dto';
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

  // GET api/v1/orders
  @Get()
  @ApiOperation({ summary: 'Get orders for user' })
  @ApiOAuth2([])
  @ApiHeader({
    name: 'Authorization',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: OrderSummaryDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization Error',
  })
  getOrders(
    @Headers('Authorization') token: string
  ): Promise<OrderSummaryDto[]> {
    return this._ordersService.getOrdersFromUser(token);
  }

  // GET api/v1/orders/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiOAuth2([])
  @ApiHeader({
    name: 'Authorization',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found record',
    type: OrderReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  getOrder(
    @Param('id', ParseIntPipe) id: number,
    @Headers('Authorization') token: string
  ): Promise<OrderReadDto> {
    return this._ordersService.getOrder(id, token);
  }
}
