module.exports = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: process.env.PG_BASKET_USER,
  password: process.env.PG_BASKET_PASSWORD,
  database: process.env.PG_BASKET_DB,
  migrations: [__dirname + '/migrations/**/*.js'],
};
