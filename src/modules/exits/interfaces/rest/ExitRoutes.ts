import { Router } from 'express';
import asyncHandler from '../../../../shared/interfaces/rest/asyncHandler';
import validate from '../../../../shared/interfaces/rest/validate';
import { getValidated } from '../../../../shared/interfaces/rest/getValidated';

import {
  idParamSchema,
  entryIdParamSchema,
  paginationQuerySchema,
} from '../../../../shared/interfaces/rest/schemas/CommonSchemas';

import {
  createExitSchema,
  updateExitSchema,
  CreateExitDTO,
  UpdateExitDTO,
} from './schemas/ExitSchema';

import { ExitUC } from './ExitBuild';

export default function exitRoutes(uc: ExitUC) {
  const r = Router();
  
  r.get(
    '/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (_req, res) => {
      const { page = 1, pageSize = 50 } = getValidated<{ page?: number; pageSize?: number }>(res);
      const result = await uc.listExits.execute({ page, pageSize });
      res.json(result);
    })
  );
  
  r.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      const exit = await uc.getExitById.execute(Number(id));
      res.json(exit);
    })
  );
  
  r.get(
    '/by-entry/:entryId',
    validate(entryIdParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { entryId } = getValidated<{ entryId: number }>(res);
      const exit = await uc.getExitByEntryId.execute(Number(entryId));
      res.json(exit);
    })
  );
  
  r.post(
    '/',
    validate(createExitSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const dto = getValidated<CreateExitDTO>(res);
      const created = await uc.registerExit.execute({
        userId: dto.UserId,
        locationId: dto.LocationId ?? null,
        locationCode: undefined,
        exitTime: new Date(dto.ExitTime),
        result: dto.Result ?? null,
        irregularBehavior: dto.IrregularBehavior ?? false,
        deviceId: dto.DeviceId ?? null,
      });
      res.status(201).json(created);
    })
  );
  
  r.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateExitSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { id, ...patch } = getValidated<{ id: number } & UpdateExitDTO>(res);
      const updated = await uc.updateExit.execute(Number(id), patch);
      res.json(updated);
    })
  );
  
  r.delete(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      await uc.softDeleteExit.execute(Number(id));
      res.status(204).send();
    })
  );

  return r;
}