module.exports = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: process.env.PG_CATALOG_USER,
  password: process.env.PG_CATALOG_PASSWORD,
  database: process.env.PG_CATALOG_DB,
  migrations: [__dirname + '/migrations/**/*.js'],
};
