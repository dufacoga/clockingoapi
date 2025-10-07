import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.API_KEY = process.env.API_KEY ?? 'test-key';
process.env.DB_NAME = 'clockingo_test';