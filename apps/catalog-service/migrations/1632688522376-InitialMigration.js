const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialMigration1632688522376 {
    name = 'InitialMigration1632688522376'

    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`CREATE TABLE "catalog_type" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_ddcc971c9b8acf3cf16c56234db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "pictureFileName" character varying NOT NULL, "pictureUri" character varying NOT NULL, "catalogTypeId" integer, "catalogBrandId" integer, "availableStock" integer NOT NULL, "restockThreshold" integer NOT NULL, "maxStockThreshold" integer NOT NULL, "onReorder" boolean NOT NULL, CONSTRAINT "PK_8996a1f608499554f35bec8601e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog_brand" ("id" SERIAL NOT NULL, "brand" character varying NOT NULL, CONSTRAINT "PK_0741c02e568d8a41ca20bd54ce8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "catalog_item" ADD CONSTRAINT "FK_a10609cfc3bdc77bcd13d5834aa" FOREIGN KEY ("catalogTypeId") REFERENCES "catalog_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog_item" ADD CONSTRAINT "FK_9641e5f5387e4a7a380cfff3be5" FOREIGN KEY ("catalogBrandId") REFERENCES "catalog_brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "catalog_item" DROP CONSTRAINT "FK_9641e5f5387e4a7a380cfff3be5"`);
        await queryRunner.query(`ALTER TABLE "catalog_item" DROP CONSTRAINT "FK_a10609cfc3bdc77bcd13d5834aa"`);
        await queryRunner.query(`DROP TABLE "catalog_brand"`);
        await queryRunner.query(`DROP TABLE "catalog_item"`);
        await queryRunner.query(`DROP TABLE "catalog_type"`);
    }
}
