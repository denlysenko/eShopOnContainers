const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class CreateSequences1636908517819 {
  name = 'CreateSequences1636908517819';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "order_seq" ("nextval" integer NOT NULL)`
    );
    await queryRunner.query(`INSERT INTO "order_seq" VALUES (0)`);
    await queryRunner.query(
      `CREATE TABLE "order_items_seq" ("nextval" integer NOT NULL)`
    );
    await queryRunner.query(`INSERT INTO "order_items_seq" VALUES (0)`);
    await queryRunner.query(
      `CREATE TABLE "buyer_seq" ("nextval" integer NOT NULL)`
    );
    await queryRunner.query(`INSERT INTO "buyer_seq" VALUES (0)`);
    await queryRunner.query(
      `CREATE TABLE "payment_method_seq" ("nextval" integer NOT NULL)`
    );
    await queryRunner.query(`INSERT INTO "payment_method_seq" VALUES (0)`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "order_seq"`);
    await queryRunner.query(`DROP TABLE "order_items_seq"`);
    await queryRunner.query(`DROP TABLE "buyer_seq"`);
    await queryRunner.query(`DROP TABLE "payment_method_seq"`);
  }
};
