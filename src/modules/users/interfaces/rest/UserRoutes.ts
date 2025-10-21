import { Router } from 'express';
import asyncHandler from '../../../../shared/interfaces/rest/asyncHandler';
import validate from '../../../../shared/interfaces/rest/validate';
import { getValidated } from '../../../../shared/interfaces/rest/getValidated';

import {
  idParamSchema,
  usernameParamSchema,
  paginationQuerySchema,
} from '../../../../shared/interfaces/rest/schemas/CommonSchemas';

import {
  createUserSchema,
  updateUserSchema,
  UpdateUserDTO,
  updateUserTotpSchema,
  UpdateUserTotpDTO,
  verifyTotpSchema,
} from './schemas/UserSchema';

import { UserUC } from './UserBuild';

export default function userRoutes(uc: UserUC) {
  const r = Router();
  
  r.get(
    '/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (_req, res) => {
      const { page = 1, pageSize = 50 } = getValidated<{ page?: number; pageSize?: number }>(res);
      const result = await uc.listUsers.execute({ page, pageSize });
      res.json(result);
    })
  );
  
  r.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      const user = await uc.getUserById.execute(Number(id));
      res.json(user);
    })
  );
  
  r.get(
    '/username/:username',
    validate(usernameParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { username } = getValidated<{ username: string }>(res);
      const user = await uc.getUserByUsername.execute(username);
      res.json(user);
    })
  );
  
  r.post(
    '/',
    validate(createUserSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const dto = getValidated<{
        Name: string;
        Phone?: string | null;
        Username: string;
        AuthToken: string;
        RoleId: number;
      }>(res);

      const created = await uc.createUser.execute({
        name: dto.Name,
        phone: dto.Phone ?? null,
        username: dto.Username,
        authToken: dto.AuthToken,
        roleId: dto.RoleId,
      });
      res.status(201).json(created);
    })
  );

  r.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateUserSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { id, ...patch } = getValidated<{ id: number } & UpdateUserDTO>(res);
      const updated = await uc.updateUser.execute(Number(id), patch);
      res.json(updated);
    })
  );

  r.patch(
    '/:id/totp',
    validate(idParamSchema, 'params'),
    validate(updateUserTotpSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { id, ...patch } = getValidated<{ id: number } & UpdateUserTotpDTO>(res);
      const updated = await uc.updateUserTotp.execute(Number(id), patch);
      res.json(updated);
    })
  );
  
  r.delete(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      await uc.softDeleteUser.execute(Number(id));
      res.status(204).send();
    })
  );

  r.post(
    '/:id/totp/verify',
    validate(idParamSchema, 'params'),
    validate(verifyTotpSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { id, code } = getValidated<{ id: number } & { code: string }>(res);
      const ok = await uc.verifyTotp.execute({ userId: Number(id), code });
      res.json({ valid: ok });
    })
  );

  return r;
}