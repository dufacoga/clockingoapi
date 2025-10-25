import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY };

function uniqueMenuName(prefix = 'Menu') {
  return `${prefix} ${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

type MenuFixtureOverrides = Partial<{
  NameEs: string;
  NameEn: string;
  ParentId: number | null;
  Level: number;
  DisplayOrder: number;
}>;

async function createMenuFixture(overrides: MenuFixtureOverrides = {}) {
  const payload: Record<string, unknown> = {
    NameEs: overrides.NameEs ?? uniqueMenuName('Menu ES'),
    NameEn: overrides.NameEn ?? uniqueMenuName('Menu EN'),
    DisplayOrder: overrides.DisplayOrder ?? 0,
  };

  if (overrides.ParentId !== undefined) {
    payload.ParentId = overrides.ParentId;
  }

  if (overrides.Level !== undefined) {
    payload.Level = overrides.Level;
  }

  const res = await request(app).post('/menus').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return res.body as {
    Id: number;
    NameEs: string;
    NameEn: string;
    ParentId: number | null;
    Level: number;
    DisplayOrder: number;
  };
}

describe('API - /menus', () => {
  describe('GET /menus', () => {
    it('returns paginated list', async () => {
      const res = await request(app).get('/menus').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /menus/:id', () => {
    it('returns a single menu', async () => {
      const menu = await createMenuFixture();
      const res = await request(app).get(`/menus/${menu.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(menu.Id);
      expect(res.body.NameEs).toBe(menu.NameEs);
    });

    it('returns 404 when menu not found', async () => {
      const res = await request(app).get('/menus/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_NOT_FOUND');
    });
  });

  describe('GET /menus/parents/:parentId', () => {
    it('returns menus grouped by parent id', async () => {
      const root = await createMenuFixture({ DisplayOrder: 1 });
      const child = await createMenuFixture({ ParentId: root.Id, DisplayOrder: 2 });

      const rootRes = await request(app).get('/menus/parents/0').set(apiKeyHeader);
      expect(rootRes.status).toBe(200);
      expect(Array.isArray(rootRes.body)).toBe(true);
      expect(rootRes.body.some((menu: { Id: number }) => menu.Id === root.Id)).toBe(true);

      const childRes = await request(app).get(`/menus/parents/${root.Id}`).set(apiKeyHeader);
      expect(childRes.status).toBe(200);
      expect(Array.isArray(childRes.body)).toBe(true);
      expect(childRes.body.some((menu: { Id: number }) => menu.Id === child.Id)).toBe(true);
    });
  });

  describe('GET /menus/roles/:roleId', () => {
    it('returns menus assigned to a role', async () => {
      const first = await createMenuFixture();
      const second = await createMenuFixture();

      const assignRes = await request(app)
        .put('/menus/roles/1')
        .set(apiKeyHeader)
        .send({ MenuIds: [first.Id, second.Id] });
      expect(assignRes.status).toBe(204);

      const res = await request(app).get('/menus/roles/1').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const ids = res.body.map((menu: { Id: number }) => menu.Id);
      expect(ids).toEqual(expect.arrayContaining([first.Id, second.Id]));
    });

    it('returns 404 when role not found', async () => {
      const res = await request(app).get('/menus/roles/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ROLE_NOT_FOUND');
    });
  });

  describe('POST /menus', () => {
    it('creates a new menu', async () => {
      const payload = {
        NameEs: uniqueMenuName('Crear Menu ES'),
        NameEn: uniqueMenuName('Create Menu EN'),
        DisplayOrder: 3,
      };

      const res = await request(app).post('/menus').set(apiKeyHeader).send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        NameEs: payload.NameEs,
        NameEn: payload.NameEn,
        ParentId: null,
        Level: 1,
        DisplayOrder: payload.DisplayOrder,
        IsDeleted: false,
      });
      expect(typeof res.body.Id).toBe('number');
    });

    it('returns 404 when parent menu does not exist', async () => {
      const res = await request(app)
        .post('/menus')
        .set(apiKeyHeader)
        .send({
          NameEs: uniqueMenuName('Missing Parent ES'),
          NameEn: uniqueMenuName('Missing Parent EN'),
          ParentId: 999999,
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_PARENT_NOT_FOUND');
    });

    it('returns 409 when menu names already exist for the parent', async () => {
      const nameEs = uniqueMenuName('Dup ES');
      const nameEn = uniqueMenuName('Dup EN');
      await createMenuFixture({ NameEs: nameEs, NameEn: nameEn });

      const res = await request(app)
        .post('/menus')
        .set(apiKeyHeader)
        .send({ NameEs: nameEs, NameEn: nameEn });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('MENU_NAME_ALREADY_EXISTS');
    });

    it('returns 400 when level is invalid for root menu', async () => {
      const res = await request(app)
        .post('/menus')
        .set(apiKeyHeader)
        .send({
          NameEs: uniqueMenuName('Bad Level ES'),
          NameEn: uniqueMenuName('Bad Level EN'),
          Level: 3,
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('MENU_INVALID_LEVEL');
    });

    it('returns 400 when payload invalid', async () => {
      const res = await request(app).post('/menus').set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /menus/:id', () => {
    it('updates menu fields including parent', async () => {
      const original = await createMenuFixture({ DisplayOrder: 1 });
      const newParent = await createMenuFixture({ DisplayOrder: 2 });

      const res = await request(app)
        .patch(`/menus/${original.Id}`)
        .set(apiKeyHeader)
        .send({
          NameEs: 'Updated ES',
          NameEn: 'Updated EN',
          ParentId: newParent.Id,
          Level: 2,
          DisplayOrder: 5,
        });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        Id: original.Id,
        NameEs: 'Updated ES',
        NameEn: 'Updated EN',
        ParentId: newParent.Id,
        Level: 2,
        DisplayOrder: 5,
      });
    });

    it('returns 404 when menu does not exist', async () => {
      const res = await request(app)
        .patch('/menus/999999')
        .set(apiKeyHeader)
        .send({ NameEs: 'Does Not Exist' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_NOT_FOUND');
    });

    it('returns 404 when updating to a non existing parent', async () => {
      const menu = await createMenuFixture();
      const res = await request(app)
        .patch(`/menus/${menu.Id}`)
        .set(apiKeyHeader)
        .send({ ParentId: 999999, Level: 2 });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_PARENT_NOT_FOUND');
    });

    it('returns 400 when parent is the menu itself', async () => {
      const menu = await createMenuFixture();
      const res = await request(app)
        .patch(`/menus/${menu.Id}`)
        .set(apiKeyHeader)
        .send({ ParentId: menu.Id });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('MENU_PARENT_CANNOT_BE_SELF');
    });

    it('returns 409 when updating to duplicate names', async () => {
      const nameEs = uniqueMenuName('Dup Update ES');
      const nameEn = uniqueMenuName('Dup Update EN');
      await createMenuFixture({ NameEs: nameEs, NameEn: nameEn });
      const target = await createMenuFixture();

      const res = await request(app)
        .patch(`/menus/${target.Id}`)
        .set(apiKeyHeader)
        .send({ NameEs: nameEs, NameEn: nameEn });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('MENU_NAME_ALREADY_EXISTS');
    });

    it('returns 400 when level inconsistent with parent', async () => {
      const parent = await createMenuFixture();
      const child = await createMenuFixture({ ParentId: parent.Id });

      const res = await request(app)
        .patch(`/menus/${child.Id}`)
        .set(apiKeyHeader)
        .send({ Level: 5 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('MENU_INVALID_LEVEL');
    });

    it('returns 400 when updated names are blank', async () => {
      const menu = await createMenuFixture();
      const res = await request(app)
        .patch(`/menus/${menu.Id}`)
        .set(apiKeyHeader)
        .send({ NameEs: '   ' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('MENU_INVALID_NAME');
    });
  });

  describe('DELETE /menus/:id', () => {
    it('soft deletes a menu', async () => {
      const menu = await createMenuFixture();
      const delRes = await request(app).delete(`/menus/${menu.Id}`).set(apiKeyHeader);
      expect([200, 204]).toContain(delRes.status);

      const res = await request(app).get(`/menus/${menu.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_NOT_FOUND');
    });

    it('returns 404 when deleting non-existing menu', async () => {
      const res = await request(app).delete('/menus/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_NOT_FOUND');
    });
  });

  describe('PUT /menus/roles/:roleId', () => {
    it('assigns menus to a role', async () => {
      const first = await createMenuFixture();
      const second = await createMenuFixture();

      const res = await request(app)
        .put('/menus/roles/1')
        .set(apiKeyHeader)
        .send({ MenuIds: [first.Id, second.Id] });
      expect(res.status).toBe(204);

      const listRes = await request(app).get('/menus/roles/1').set(apiKeyHeader);
      expect(listRes.status).toBe(200);
      const ids = listRes.body.map((menu: { Id: number }) => menu.Id);
      expect(ids).toEqual(expect.arrayContaining([first.Id, second.Id]));
    });

    it('returns 404 when role does not exist', async () => {
      const menu = await createMenuFixture();
      const res = await request(app)
        .put('/menus/roles/999999')
        .set(apiKeyHeader)
        .send({ MenuIds: [menu.Id] });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ROLE_NOT_FOUND');
    });

    it('returns 404 when any menu does not exist', async () => {
      const menu = await createMenuFixture();
      const res = await request(app)
        .put('/menus/roles/1')
        .set(apiKeyHeader)
        .send({ MenuIds: [menu.Id, 999999] });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MENU_NOT_FOUND');
    });

    it('returns 400 when payload invalid', async () => {
      const res = await request(app).put('/menus/roles/1').set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });
});
