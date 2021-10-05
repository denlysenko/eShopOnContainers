const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class UpdateCatalogItem1633413571266 {
  name = 'UpdateCatalogItem1633413571266';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "public"."catalog_item" ALTER COLUMN "price" TYPE double precision`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "public"."catalog_item" ALTER COLUMN "price" TYPE integer`
    );
  }
};
