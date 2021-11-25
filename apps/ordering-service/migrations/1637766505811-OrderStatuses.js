const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class OrderStatuses1637766505811 {
  name = 'OrderStatuses1637766505811';

  async up(queryRunner) {
    await queryRunner.query(
      `INSERT INTO "order_statuses" ("id", "name") VALUES (1, 'Submitted'), (2, 'AwaitingValidation'), (3, 'StockConfirmed'), (4, 'Paid'), (5, 'Shipped'), (6, 'Cancelled')`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "order_statuses"`);
  }
};
