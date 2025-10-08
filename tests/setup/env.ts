import dotenv from 'dotenv'
dotenv.config({ path: '.env.docker' })

process.env.NODE_ENV = 'test';
process.env.API_KEY = process.env.API_KEY ?? 'supersecret123';
process.env.DB_NAME = 'clockingo_test';


console.log('[ENV DEBUG]', {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  NODE_ENV: process.env.NODE_ENV,
})