import { Connection } from 'typeorm';
import { buyer } from '../fixtures/buyer';
import { order } from '../fixtures/order';
import { orderItems } from '../fixtures/order-items';
import { paymentMethod } from '../fixtures/payment-method';

export async function seedSequences(connection: Connection): Promise<void> {
  const queryRunner = connection.createQueryRunner();

  await queryRunner.query(
    `CREATE TABLE "order_seq" ("nextval" integer NOT NULL)`
  );
  await queryRunner.query(`INSERT INTO "order_seq" VALUES ($1)`, [
    order.id + 1,
  ]);
  await queryRunner.query(
    `CREATE TABLE "order_items_seq" ("nextval" integer NOT NULL)`
  );
  await queryRunner.query(`INSERT INTO "order_items_seq" VALUES ($1)`, [
    orderItems[orderItems.length - 1].id + 1,
  ]);
  await queryRunner.query(
    `CREATE TABLE "buyer_seq" ("nextval" integer NOT NULL)`
  );
  await queryRunner.query(`INSERT INTO "buyer_seq" VALUES ($1)`, [
    buyer.id + 1,
  ]);
  await queryRunner.query(
    `CREATE TABLE "payment_method_seq" ("nextval" integer NOT NULL)`
  );
  await queryRunner.query(`INSERT INTO "payment_method_seq" VALUES ($1)`, [
    paymentMethod.id + 1,
  ]);

  await queryRunner.release();
}
