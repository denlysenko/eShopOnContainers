const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateOutbox1632941441707 {
    name = 'UpdateOutbox1632941441707'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."outbox" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."outbox" DROP COLUMN "updatedAt"`);
    }
}
