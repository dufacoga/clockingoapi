import { Router } from 'express';
import asyncHandler from '../../../../shared/interfaces/rest/asyncHandler';
import validate from '../../../../shared/interfaces/rest/validate';
import { getValidated } from '../../../../shared/interfaces/rest/getValidated';

import { idParamSchema, userIdParamSchema, paginationQuerySchema } from '../../../../shared/interfaces/rest/schemas/CommonSchemas';
import { createEntrySchema, updateEntrySchema, CreateEntryDTO, UpdateEntryDTO } from './schemas/EntrySchema';
import { EntryUC } from './EntryBuild';

export default function entryRoutes(uc: EntryUC) {
  const r = Router();

  r.get(
    '/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
      const { page = 1, pageSize = 50 } = getValidated<{ page?: number; pageSize?: number }>(res);
      const result = await uc.listEntries.execute({ page, pageSize });
      res.json(result);
    })
  );

  r.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      const entry = await uc.getEntryById.execute(Number(id));
      res.json(entry);
    })
  );

  r.get(
    '/last/:userId',
    validate(userIdParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { userId } = getValidated<{ userId: number }>(res);
      const result = await uc.getLastEntryByUser.execute(Number(userId));
      res.json(result);
    })
  );

  r.post(
    '/',
    validate(createEntrySchema, 'body'),
    asyncHandler(async (_req, res) => {
      const dto = getValidated<CreateEntryDTO>(res);
      const created = await uc.registerEntry.execute({
        userId: dto.UserId,
        locationId: dto.LocationId ?? null,
        entryTime: new Date(dto.EntryTime),
        selfie: dto.Selfie ? Buffer.from(dto.Selfie, 'base64') : null,
        deviceId: dto.DeviceId ?? null,
      });
      res.status(201).json(created);
    })
  );

  r.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateEntrySchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { id, ...patch } = getValidated<{ id: number } & UpdateEntryDTO>(res);
      const updated = await uc.updateEntry.execute(Number(id), patch);
      res.json(updated);
    })
  );

  r.delete(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      await uc.softDeleteEntry.execute(Number(id));
      res.status(204).send();
    })
  );

  return r;
}