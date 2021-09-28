const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateCatalogItem1632813237845 {
    name = 'UpdateCatalogItem1632813237845'

    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX "name-idx" ON "public"."catalog_item" ("name") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."name-idx"`);
    }
}
