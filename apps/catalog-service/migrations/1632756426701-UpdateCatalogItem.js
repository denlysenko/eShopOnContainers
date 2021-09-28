const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateCatalogItem1632756426701 {
    name = 'UpdateCatalogItem1632756426701'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."catalog_item" ALTER COLUMN "pictureUri" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."catalog_item" ALTER COLUMN "restockThreshold" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."catalog_item" ALTER COLUMN "maxStockThreshold" DROP NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."catalog_item" ALTER COLUMN "maxStockThreshold" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."catalog_item" ALTER COLUMN "restockThreshold" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."catalog_item" ALTER COLUMN "pictureUri" SET NOT NULL`);
    }
}
