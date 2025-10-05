import knexLib, { Knex } from 'knex';

const db: Knex = knexLib({
  client: process.env.DB_CLIENT ?? 'mysql2',
  connection: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'cortes_clockingo'
  },
  pool: { min: 0, max: 10 }
});

export default db;