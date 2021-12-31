const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialMigration1637337278306 {
    name = 'InitialMigration1637337278306'

    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`CREATE TABLE "basket_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buyerId" character varying NOT NULL, "productId" integer NOT NULL, "productName" character varying NOT NULL, "unitPrice" double precision NOT NULL, "oldUnitPrice" double precision NOT NULL, "quantity" integer NOT NULL, "pictureUrl" character varying, CONSTRAINT "PK_9c916f29c8b703688fd4b1717c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inbox" ("id" character varying NOT NULL, CONSTRAINT "PK_ab7abc299fab4bb4f965549c819" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" character varying NOT NULL, "payload" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TABLE "inbox"`);
        await queryRunner.query(`DROP TABLE "basket_items"`);
    }
}
