import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { OrderItemsMapper, OrdersMapper } from '../../../application';
import { DomainEvents, Order, OrderRepository } from '../../../domain';
import { CardTypeEntity } from '../entities/card-type.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';

export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _ordersRepository: Repository<OrderEntity>,
    @InjectRepository(CardTypeEntity)
    private readonly _cardTypesRepository: Repository<CardTypeEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly _orderItemRepository: Repository<OrderItemEntity>,
    private readonly _connection: Connection
  ) {}

  queryCardTypes() {
    return this._cardTypesRepository.find();
  }

  queryOrder(id: number, buyerId: number) {
    return this._ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderStatus', 'os')
      .leftJoinAndSelect('order.orderItems', 'oi')
      .select([
        'order.id',
        'order.orderDate',
        'order.description',
        'order.city',
        'order.country',
        'order.street',
        'order.zipCode',
        'order.state',
        'os.name',
        'oi.productName',
        'oi.units',
        'oi.unitPrice',
        'oi.pictureUrl',
      ])
      .where('order.id = :id', { id })
      .andWhere('order.buyerId = :buyerId', { buyerId })
      .getOne();
  }

  queryOrdersFromUser(userId: string) {
    return this._ordersRepository
      .createQueryBuilder('order')
      .select([
        'order.id AS id',
        'order.orderDate AS "orderDate"',
        'os.name AS status',
        'SUM(oi.units * oi.unitPrice) AS total',
      ])
      .leftJoin('order.orderItems', 'oi')
      .leftJoin('order.orderStatus', 'os')
      .leftJoin('order.buyer', 'ob')
      .where('ob.identityGuid = :userId', { userId })
      .groupBy('order.id')
      .addGroupBy('order.orderDate')
      .addGroupBy('os.name')
      .orderBy('order.id')
      .getRawMany();
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this._ordersRepository.findOne(
      { id },
      {
        relations: ['orderItems'],
      }
    );

    if (!order) {
      return null;
    }

    return OrdersMapper.toDomain(order);
  }

  async addOrder(order: Order): Promise<Order> {
    const createdOrder = this._ordersRepository.create(
      OrdersMapper.toPersistence(order)
    );

    const createdOrderItems = this._orderItemRepository.create(
      order.orderItems.map((orderItem) =>
        OrderItemsMapper.toPersistence(orderItem, order.id)
      )
    );

    await this._ordersRepository.insert(createdOrder);
    await this._orderItemRepository.insert(createdOrderItems);
    // TODO: move this to TypeORM hooks(subscriber: afterInsert)
    DomainEvents.dispatchEventsForAggregate(order.id);

    return order;
  }

  async updateOrder(order: Order): Promise<void> {
    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const orderItems = order.orderItems.map((orderItem) =>
        OrderItemsMapper.toPersistence(orderItem, order.id)
      );

      await Promise.all([
        this._ordersRepository.update(
          order.id,
          OrdersMapper.toPersistence(order)
        ),
        this._orderItemRepository.save(orderItems),
      ]);

      await queryRunner.commitTransaction();

      // TODO: move this to TypeORM hooks(subscriber: afterInsert)
      DomainEvents.dispatchEventsForAggregate(order.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async nextOrderId(): Promise<number> {
    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.connect();

    const raw = await queryRunner.query(
      'UPDATE order_seq SET nextval=nextval + 1 RETURNING nextval'
    );

    await queryRunner.release();

    return raw[0][0].nextval;
  }

  async nextOrderItemId(): Promise<number> {
    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.connect();

    const raw = await queryRunner.query(
      'UPDATE order_items_seq SET nextval=nextval + 1 RETURNING nextval'
    );

    await queryRunner.release();

    return raw[0][0].nextval;
  }
}
