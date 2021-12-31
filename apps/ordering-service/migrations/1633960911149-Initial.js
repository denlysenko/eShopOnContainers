const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1633960911149 {
    name = 'Initial1633960911149'

    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`CREATE TABLE "card_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_2e832349781fa27274c3dbdeb30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" SERIAL NOT NULL, "cardHolderName" character varying NOT NULL, "alias" character varying, "cardNumber" character varying NOT NULL, "expiration" TIMESTAMP NOT NULL, "cardTypeId" integer NOT NULL, "buyerId" integer NOT NULL, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buyers" ("id" SERIAL NOT NULL, "identityGuid" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_cc18074e04ccf2419b25c19bc7b" UNIQUE ("identityGuid"), CONSTRAINT "PK_aff372821d05bac04a18ff8eb87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_statuses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_76c6dc5bccb3ef1a4a8510cab3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "zipCode" character varying NOT NULL, "country" character varying NOT NULL, "orderDate" TIMESTAMP NOT NULL, "description" character varying, "paymentMethodId" integer NOT NULL, "buyerId" integer NOT NULL, "orderStatusId" integer NOT NULL, CONSTRAINT "REL_20b3eb7c96605f814cc86a916b" UNIQUE ("orderStatusId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "discount" integer, "productId" integer NOT NULL, "productName" character varying NOT NULL, "unitPrice" double precision NOT NULL, "units" integer NOT NULL, "pictureUrl" character varying, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_f28626ed800da08495d54db1e3c" FOREIGN KEY ("cardTypeId") REFERENCES "card_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_b2b076e44e12f75ecb07db75526" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_c137e0afcc291b9135d3e0c3d4e" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_20b3eb7c96605f814cc86a916be" FOREIGN KEY ("orderStatusId") REFERENCES "order_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_20b3eb7c96605f814cc86a916be"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_c137e0afcc291b9135d3e0c3d4e"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_b2b076e44e12f75ecb07db75526"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_f28626ed800da08495d54db1e3c"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_statuses"`);
        await queryRunner.query(`DROP TABLE "buyers"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TABLE "card_types"`);
    }
}
