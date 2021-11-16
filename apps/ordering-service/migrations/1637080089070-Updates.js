const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Updates1637080089070 {
    name = 'Updates1637080089070'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "inbox" ("id" character varying NOT NULL, CONSTRAINT "PK_ab7abc299fab4bb4f965549c819" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" character varying NOT NULL, "payload" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD "cardSecurityNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP CONSTRAINT "FK_c137e0afcc291b9135d3e0c3d4e"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "public"."payment_methods_id_seq"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP CONSTRAINT "FK_b2b076e44e12f75ecb07db75526"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d"`);
        await queryRunner.query(`ALTER TABLE "public"."buyers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "public"."buyers_id_seq"`);
        await queryRunner.query(`ALTER TABLE "public"."order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "public"."orders_id_seq"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "paymentMethodId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "buyerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."order_items" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "public"."order_items_id_seq"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "FK_b2b076e44e12f75ecb07db75526" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD CONSTRAINT "FK_c137e0afcc291b9135d3e0c3d4e" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP CONSTRAINT "FK_c137e0afcc291b9135d3e0c3d4e"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP CONSTRAINT "FK_b2b076e44e12f75ecb07db75526"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "public"."order_items_id_seq" OWNED BY "public"."order_items"."id"`);
        await queryRunner.query(`ALTER TABLE "public"."order_items" ALTER COLUMN "id" SET DEFAULT nextval('"public"."order_items_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "buyerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "paymentMethodId" SET NOT NULL`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "public"."orders_id_seq" OWNED BY "public"."orders"."id"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "id" SET DEFAULT nextval('"public"."orders_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "public"."order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "public"."buyers_id_seq" OWNED BY "public"."buyers"."id"`);
        await queryRunner.query(`ALTER TABLE "public"."buyers" ALTER COLUMN "id" SET DEFAULT nextval('"public"."buyers_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "FK_b2b076e44e12f75ecb07db75526" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "public"."payment_methods_id_seq" OWNED BY "public"."payment_methods"."id"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" ALTER COLUMN "id" SET DEFAULT nextval('"public"."payment_methods_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD CONSTRAINT "FK_c137e0afcc291b9135d3e0c3d4e" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "public"."payment_methods" DROP COLUMN "cardSecurityNumber"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TABLE "inbox"`);
    }
}
