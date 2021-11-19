import * as dotenv from 'dotenv';

dotenv.config();

export = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.PG_BASKET_USER,
  password: process.env.PG_BASKET_PASSWORD,
  database: process.env.PG_BASKET_DB,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/migrations',
  },
};
