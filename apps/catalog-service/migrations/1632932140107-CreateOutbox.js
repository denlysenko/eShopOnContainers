const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateOutbox1632932140107 {
    name = 'CreateOutbox1632932140107'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "outbox" ("id" SERIAL NOT NULL, "payload" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "outbox"`);
    }
}
