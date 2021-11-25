const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class CardTypes1637766455587 {
  name = 'CardTypes1637766455587';

  async up(queryRunner) {
    await queryRunner.query(
      `INSERT INTO "card_types" ("id", "name") VALUES (1, 'Amex'), (2, 'Visa'), (3, 'MasterCard'), (4, 'Capital One')`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "card_types"`);
  }
};
