import { Router } from 'express';
import asyncHandler from './asyncHandler';
import knex from '../../infrastructure/db/knex';
export default function healthRoutes() {
  const r = Router();

  r.get(
    '/health',
    asyncHandler(async (_req, res) => {
      let dbOk = false;

      try {
        await knex.raw('SELECT 1');
        dbOk = true;
      } catch (err) {
        console.error('❌ DB connection failed in /health:', err);
      }

      const statusCode = dbOk ? 200 : 503;
      res.status(statusCode).json({
        ok: dbOk,
        db: dbOk,
        timestamp: new Date().toISOString(),
      });
    })
  );

  return r;
}