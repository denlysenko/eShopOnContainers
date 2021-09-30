const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateOutbox1632938419796 {
    name = 'UpdateOutbox1632938419796'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."outbox" DROP CONSTRAINT "PK_340ab539f309f03bdaa14aa7649"`);
        await queryRunner.query(`ALTER TABLE "public"."outbox" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."outbox" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."outbox" ADD CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id")`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."outbox" DROP CONSTRAINT "PK_340ab539f309f03bdaa14aa7649"`);
        await queryRunner.query(`ALTER TABLE "public"."outbox" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."outbox" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."outbox" ADD CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id")`);
    }
}
