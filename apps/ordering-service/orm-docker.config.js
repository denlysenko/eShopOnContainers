module.exports = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: process.env.PG_ORDERING_USER,
  password: process.env.PG_ORDERING_PASSWORD,
  database: process.env.PG_ORDERING_DB,
  migrations: [__dirname + '/migrations/**/*.js'],
};
