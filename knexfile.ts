import { Knex } from 'knex';
import 'dotenv/config'
import { env } from './src/env';


export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
      filename: env.DATABASE_URL // ou app.sqlite
  },
  useNullAsDefault: true,
  migrations: {
      extension: 'ts',
      directory: './db/migrations/'
  }
}

export default config;