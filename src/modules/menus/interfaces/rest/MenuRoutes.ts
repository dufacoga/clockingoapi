import { Router } from 'express';

import asyncHandler from '../../../../shared/interfaces/rest/asyncHandler';
import validate from '../../../../shared/interfaces/rest/validate';
import { getValidated } from '../../../../shared/interfaces/rest/getValidated';

import {
  idParamSchema,
  paginationQuerySchema,
  roleIdParamSchema,
  parentIdParamSchema,
} from '../../../../shared/interfaces/rest/schemas/CommonSchemas';

import {
  createMenuSchema,
  updateMenuSchema,
  assignMenusToRoleSchema,
  UpdateMenuDTO,
  AssignMenusToRoleDTO,
} from './schemas/MenuSchema';

import { MenuUC } from './MenuBuild';

export default function menuRoutes(uc: MenuUC) {
  const r = Router();

  r.get(
    '/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (_req, res) => {
      const { page = 1, pageSize = 50 } = getValidated<{ page?: number; pageSize?: number }>(res);
      const result = await uc.listMenus.execute({ page, pageSize });
      res.json(result);
    })
  );

  r.get(
    '/roles/:roleId',
    validate(roleIdParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { roleId } = getValidated<{ roleId: number }>(res);
      const menus = await uc.listMenusByRole.execute(Number(roleId));
      res.json(menus);
    })
  );

  r.get(
    '/parents/:parentId',
    validate(parentIdParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { parentId } = getValidated<{ parentId: number }>(res);
      const normalizedParentId = parentId === 0 ? null : parentId;
      const menus = await uc.listMenusByParentId.execute(normalizedParentId);
      res.json(menus);
    })
  );

  r.put(
    '/roles/:roleId',
    validate(roleIdParamSchema, 'params'),
    validate(assignMenusToRoleSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { roleId, MenuIds } = getValidated<{ roleId: number } & AssignMenusToRoleDTO>(res);
      await uc.assignMenusToRole.execute(Number(roleId), MenuIds);
      res.status(204).send();
    })
  );

  r.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      const menu = await uc.getMenuById.execute(Number(id));
      res.json(menu);
    })
  );

  r.post(
    '/',
    validate(createMenuSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const dto = getValidated<{
        NameEs: string;
        NameEn: string;
        ParentId?: number | null;
        Level?: number;
        DisplayOrder?: number;
      }>(res);

      const created = await uc.createMenu.execute({
        nameEs: dto.NameEs,
        nameEn: dto.NameEn,
        parentId: dto.ParentId ?? null,
        level: dto.Level,
        displayOrder: dto.DisplayOrder ?? 0,
      });

      res.status(201).json(created);
    })
  );

  r.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateMenuSchema, 'body'),
    asyncHandler(async (_req, res) => {
      const { id, ...patch } = getValidated<{ id: number } & UpdateMenuDTO>(res);
      const updated = await uc.updateMenu.execute(Number(id), {
        nameEs: patch.NameEs,
        nameEn: patch.NameEn,
        parentId: patch.ParentId !== undefined ? patch.ParentId : undefined,
        level: patch.Level,
        displayOrder: patch.DisplayOrder,
      });

      res.json(updated);
    })
  );

  r.delete(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (_req, res) => {
      const { id } = getValidated<{ id: number }>(res);
      await uc.softDeleteMenu.execute(Number(id));
      res.status(204).send();
    })
  );

  return r;
}
