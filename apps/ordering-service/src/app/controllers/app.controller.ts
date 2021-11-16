import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';
import {
  BasketItemDto,
  CancelOrderCommand,
  CardTypeReadDto,
  CreateOrderDraftCommand,
  Mediator,
  OrderQueries,
  OrderReadDto,
  OrderSummaryDto,
  ShipOrderCommand,
  ValidationErrorDto,
} from '../application';
import { OrderDraftDto } from '../application/dto/order-draft.dto';
import { BasketItemMapper } from '../application/mappers/basket-item.mapper';
import { exceptionFactory } from '../exception.factory';
import { AuthGuard, Identity } from '../infrastructure';

@Controller('v1/orders')
@UseGuards(AuthGuard)
@ApiTags('Orders')
export class AppController {
  constructor(
    private readonly _orderQueries: OrderQueries,
    private readonly _mediator: Mediator
  ) {}

  // GET api/v1/orders
  @Get()
  @ApiOperation({ summary: 'Get orders for user' })
  // TODO: replace with keycloak authorization
  // https://stackoverflow.com/questions/41918845/keycloak-integration-in-swagger
  @ApiHeader({
    name: 'Authentication',
    description: 'Authentication header',
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
  getOrders(@Identity() identity: string): Promise<OrderSummaryDto[]> {
    return this._orderQueries.getOrdersFromUser(identity);
  }

  // GET api/v1/orders/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  // TODO: replace with keycloak authorization
  @ApiHeader({
    name: 'Authentication',
    description: 'Authentication header',
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
  getOrder(@Param('id', ParseIntPipe) id: number): Promise<OrderReadDto> {
    return this._orderQueries.getOrder(id);
  }

  // PUT api/v1/orders/:id/cancel
  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancels order' })
  // TODO: replace with keycloak authorization
  @ApiHeader({
    name: 'Authentication',
    description: 'Authentication header',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cancel success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization Error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order Not Found',
  })
  async cancelOrder(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const command = new CancelOrderCommand(id);
    const result = await this._mediator.send<CancelOrderCommand>(command);

    if (!result.success && result.error) {
      throw new BadRequestException(result.error.message);
    }

    if (!result.success) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return result.success;
  }

  // PUT api/v1/orders/:id/ship
  @Put(':id/ship')
  @ApiOperation({ summary: 'Ships order' })
  // TODO: replace with keycloak authorization
  @ApiHeader({
    name: 'Authentication',
    description: 'Authentication header',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ship success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization Error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order Not Found',
  })
  async shipOrder(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const command = new ShipOrderCommand(id);
    const result = await this._mediator.send<ShipOrderCommand>(command);

    if (!result.success && result.error) {
      throw new BadRequestException(result.error.message);
    }

    if (!result.success) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return result.success;
  }

  // POST api/v1/orders/draft
  @Post('draft')
  @ApiOperation({ summary: 'Creates draft order' })
  // TODO: replace with keycloak authorization
  @ApiHeader({
    name: 'Authentication',
    description: 'Authentication header',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ship success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  async createDraftOrder(
    @Identity() identity: string,
    @Body(new ParseArrayPipe({ items: BasketItemDto, exceptionFactory }))
    basketItemsDtos: BasketItemDto[]
  ): Promise<OrderDraftDto> {
    const basketItems = basketItemsDtos.map((basketItemDto) =>
      BasketItemMapper.toModel(basketItemDto)
    );
    const command = new CreateOrderDraftCommand(identity, basketItems);

    const errors = await validate(command);

    if (errors.length > 0) {
      throw exceptionFactory(errors);
    }

    const result = await this._mediator.send<
      CreateOrderDraftCommand,
      OrderDraftDto
    >(command);

    return result.data;
  }

  // GET api/v1/orders/card-types
  @Get('card-types')
  @ApiOperation({ summary: 'Get card types' })
  // TODO: replace with keycloak authorization
  @ApiHeader({
    name: 'Authentication',
    description: 'Authentication header',
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
  getCardTypes(): Promise<CardTypeReadDto[]> {
    return this._orderQueries.getCardTypes();
  }
}
