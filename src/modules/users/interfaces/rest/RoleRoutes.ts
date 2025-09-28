import { Router } from 'express';
import asyncHandler from '../../../../shared/interfaces/rest/asyncHandler';
import validate from '../../../../shared/interfaces/rest/validate';
import { getValidated } from '../../../../shared/interfaces/rest/getValidated';
import { idParamSchema, paginationQuerySchema } from '../../../../shared/interfaces/rest/schemas/CommonSchemas';
import { RoleUC } from './RoleBuild';

export default function roleRoutes(uc: RoleUC) {
  const r = Router();
  
  r.get(
    '/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (_req, res) => {
      const { page = 1, pageSize = 50 } = getValidated<{ page?: number; pageSize?: number }>(res);
      const result = await uc.listRoles.execute({ page, pageSize });
      res.json(result);
    })
  );
  
  r.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      const role = await uc.getRoleById.execute(Number(id));
      res.json(role);
    })
  );

  return r;
}