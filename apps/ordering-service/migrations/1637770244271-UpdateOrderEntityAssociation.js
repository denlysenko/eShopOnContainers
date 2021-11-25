const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateOrderEntityAssociation1637770244271 {
    name = 'UpdateOrderEntityAssociation1637770244271'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_20b3eb7c96605f814cc86a916be"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "REL_20b3eb7c96605f814cc86a916b"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_20b3eb7c96605f814cc86a916be" FOREIGN KEY ("orderStatusId") REFERENCES "order_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_20b3eb7c96605f814cc86a916be"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "REL_20b3eb7c96605f814cc86a916b" UNIQUE ("orderStatusId")`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_20b3eb7c96605f814cc86a916be" FOREIGN KEY ("orderStatusId") REFERENCES "order_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
