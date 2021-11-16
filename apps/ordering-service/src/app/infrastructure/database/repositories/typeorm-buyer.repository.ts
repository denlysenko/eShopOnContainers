import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {
  BuyerMapper,
  EntityNotFoundException,
  PaymentMethodsMapper,
} from '../../../application';
import {
  Buyer,
  BuyerRepository,
  DomainEvents,
  PaymentMethod,
} from '../../../domain';
import { BuyerEntity } from '../entities/buyer.entity';
import { PaymentMethodEntity } from '../entities/payment-method.entity';

export class TypeOrmBuyerRepository implements BuyerRepository {
  constructor(
    @InjectRepository(BuyerEntity)
    private readonly _buyerRepository: Repository<BuyerEntity>,
    @InjectRepository(PaymentMethodEntity)
    private readonly _paymentMethodRepository: Repository<PaymentMethodEntity>,
    private readonly _connection: Connection
  ) {}

  async nextBuyerId(): Promise<number> {
    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.connect();

    const raw = await queryRunner.query(
      'UPDATE buyer_seq SET nextval=nextval + 1 RETURNING nextval'
    );

    await queryRunner.release();

    return raw[0][0].nextval;
  }

  async nextPaymentMethodId(): Promise<number> {
    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.connect();

    const raw = await queryRunner.query(
      'UPDATE payment_method_seq SET nextval=nextval + 1 RETURNING nextval'
    );

    await queryRunner.release();

    return raw[0][0].nextval;
  }

  async addBuyer(buyer: Buyer): Promise<Buyer> {
    const createdBuyer = this._buyerRepository.create(
      BuyerMapper.toPersistence(buyer)
    );

    const createdPaymentMethods = this._paymentMethodRepository.create(
      buyer.paymentMethods.map((paymentMethod) =>
        PaymentMethodsMapper.toPersistence(paymentMethod, buyer.id)
      )
    );

    await this._buyerRepository.insert(createdBuyer);
    await this._paymentMethodRepository.insert(createdPaymentMethods);

    // TODO: move this to TypeORM hooks(subscriber: afterInsert)
    DomainEvents.dispatchEventsForAggregate(buyer.id);

    return buyer;
  }

  async findById(id: number): Promise<Buyer> {
    const record = await this._buyerRepository.findOne(id, {
      relations: ['paymentMethods'],
    });

    if (!record) {
      throw new EntityNotFoundException(`Buyer with id ${id} not found`);
    }

    return BuyerMapper.toDomain(record);
  }

  async findByIdentity(identityGuid: string): Promise<Buyer> {
    const record = await this._buyerRepository
      .createQueryBuilder('buyer')
      .where('"identityGuid" = :identityGuid', { identityGuid })
      .leftJoinAndSelect('buyer.paymentMethods', 'paymentMethods')
      .getOne();

    if (!record) {
      return null;
    }

    return BuyerMapper.toDomain(record);
  }

  async updateBuyer(buyer: Buyer): Promise<Buyer> {
    const paymentMethods = buyer.paymentMethods.map((paymentMethod) =>
      PaymentMethodsMapper.toPersistence(paymentMethod, buyer.id)
    );

    await Promise.all([
      this._buyerRepository.update(buyer.id, BuyerMapper.toPersistence(buyer)),
      this._paymentMethodRepository.save(paymentMethods),
    ]);

    // TODO: move this to TypeORM hooks(subscriber: afterUpdate)
    DomainEvents.dispatchEventsForAggregate(buyer.id);

    return buyer;
  }

  async savePaymentMethods(
    paymentMethods: PaymentMethod[],
    buyerId: number
  ): Promise<void> {
    const records = this._paymentMethodRepository.create(
      paymentMethods.map((paymentMethod) =>
        PaymentMethodsMapper.toPersistence(paymentMethod, buyerId)
      )
    );

    await this._paymentMethodRepository.insert(records);
  }
}
