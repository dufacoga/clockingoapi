import { Router } from 'express';
import asyncHandler from '../../../../shared/interfaces/rest/asyncHandler';
import validate from '../../../../shared/interfaces/rest/validate';
import { getValidated } from '../../../../shared/interfaces/rest/getValidated';

import {
  idParamSchema,
  codeParamSchema,
  paginationQuerySchema,
} from '../../../../shared/interfaces/rest/schemas/CommonSchemas';

import {
  createLocationSchema,
  updateLocationSchema,
} from './schemas/LocationSchema';

import { LocationUC } from './LocationBuild';

export default function locationRoutes(uc: LocationUC) {
  const r = Router();
  
  r.get(
    '/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (_req, res) => {
      const { page = 1, pageSize = 50 } = getValidated<{ page?: number; pageSize?: number }>(res);
      const result = await uc.listLocations.execute({ page, pageSize });
      res.json(result);
    })
  );
  
  r.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      const loc = await uc.getLocationById.execute(Number(id));
      res.json(loc);
    })
  );
  
  r.get(
    '/code/:code',
    validate(codeParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { code } = getValidated<{ code: string }>(res);
      const loc = await uc.getLocationByCode.execute(code);
      res.json(loc);
    })
  );
  
  r.post(
    '/',
    validate(createLocationSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const dto = getValidated<{
        Code: string;
        Address?: string | null;
        City?: string | null;
        CreatedBy: number;
        IsCompanyOffice?: boolean;
      }>(res);

      const created = await uc.createLocation.execute({
        code: dto.Code,
        address: dto.Address ?? null,
        city: dto.City ?? null,
        createdBy: dto.CreatedBy,
        isCompanyOffice: dto.IsCompanyOffice ?? false,
      });

      res.status(201).json(created);
    })
  );
  
  r.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateLocationSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const p = getValidated<{ id: number } & Record<string, unknown>>(res);
      const updated = await uc.updateLocation.execute(Number(p.id), p as any);
      res.json(updated);
    })
  );

  r.delete(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      await uc.softDeleteLocation.execute(Number(id));
      res.status(204).send();
    })
  );

  return r;
}