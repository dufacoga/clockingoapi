import knex from '../../../../../shared/infrastructure/db/knex';
import { Menu } from '../../../domain/entities/Menu';
import { IMenuRepository } from '../../../domain/repositories/IMenuRepository';

interface MenuRow {
  Id: number;
  NameEs: string;
  NameEn: string;
  ParentId: number | null;
  Level: number;
  DisplayOrder: number;
  IsDeleted: 0 | 1;
}

export default class MenuRepositoryMaria implements IMenuRepository {
  table(): string {
    return 'Menus';
  }

  private rowToEntity(row: MenuRow): Menu {
    return Menu.fromRow({
      Id: row.Id,
      NameEs: row.NameEs,
      NameEn: row.NameEn,
      ParentId: row.ParentId,
      Level: row.Level,
      DisplayOrder: row.DisplayOrder,
      IsDeleted: row.IsDeleted,
    });
  }

  async findById(id: number): Promise<Menu | null> {
    const row = await knex<MenuRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async findByNames({
    nameEs,
    nameEn,
    parentId,
  }: {
    nameEs: string;
    nameEn: string;
    parentId: number | null;
  }): Promise<Menu | null> {
    const row = await knex<MenuRow>(this.table())
      .where({
        NameEs: nameEs,
        NameEn: nameEn,
        ParentId: parentId ?? null,
        IsDeleted: 0,
      })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async listPage(
    params: { page?: number; pageSize?: number } = {}
  ): Promise<{ items: Menu[]; total: number }> {
    const { page = 1, pageSize = 50 } = params;

    const base = knex<MenuRow>(this.table()).where({ IsDeleted: 0 });
    const [{ count }] = await base.clone().count<{ count: string }>({ count: '*' });

    const rows = await base
      .clone()
      .orderBy([
        { column: 'Level', order: 'asc' },
        { column: 'DisplayOrder', order: 'asc' },
        { column: 'Id', order: 'asc' },
      ])
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return { items: rows.map((row) => this.rowToEntity(row)), total: Number(count) };
  }

  async create(data: Menu): Promise<Menu> {
    const toInsert: Partial<MenuRow> = {
      NameEs: data.NameEs,
      NameEn: data.NameEn,
      ParentId: data.ParentId ?? null,
      Level: data.Level,
      DisplayOrder: data.DisplayOrder,
      IsDeleted: 0,
    };

    const [id] = await knex<MenuRow>(this.table()).insert(toInsert);
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to fetch created menu');
    return created;
  }

  async update(id: number, patch: Partial<Menu>): Promise<Menu> {
    const updateData: Partial<MenuRow> = {
      ...(patch.NameEs !== undefined && { NameEs: patch.NameEs }),
      ...(patch.NameEn !== undefined && { NameEn: patch.NameEn }),
      ...(patch.ParentId !== undefined && { ParentId: patch.ParentId ?? null }),
      ...(patch.Level !== undefined && { Level: patch.Level }),
      ...(patch.DisplayOrder !== undefined && { DisplayOrder: patch.DisplayOrder }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted ? 1 : 0 }),
    };

    await knex<MenuRow>(this.table()).where({ Id: id }).update(updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Menu not found after update');
    return updated;
  }

  async softDelete(id: number): Promise<boolean> {
    const affected = await knex<MenuRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .update({ IsDeleted: 1 });
    return affected > 0;
  }

  async listByRole(roleId: number): Promise<Menu[]> {
    const rows = await knex<MenuRow>(`${this.table()} as m`)
      .join<{ RoleId: number; MenuId: number }>('MenuRoles as mr', 'mr.MenuId', 'm.Id')
      .where('mr.RoleId', roleId)
      .andWhere('m.IsDeleted', 0)
      .orderBy([
        { column: 'm.Level', order: 'asc' },
        { column: 'm.DisplayOrder', order: 'asc' },
        { column: 'm.Id', order: 'asc' },
      ])
      .select<MenuRow[]>({
        Id: 'm.Id',
        NameEs: 'm.NameEs',
        NameEn: 'm.NameEn',
        ParentId: 'm.ParentId',
        Level: 'm.Level',
        DisplayOrder: 'm.DisplayOrder',
        IsDeleted: 'm.IsDeleted',
      });

    return rows.map((row) => this.rowToEntity(row));
  }

  async listByParentId(parentId: number | null): Promise<Menu[]> {
    const query = knex<MenuRow>(this.table())
      .where({ IsDeleted: 0 })
      .orderBy([
        { column: 'Level', order: 'asc' },
        { column: 'DisplayOrder', order: 'asc' },
        { column: 'Id', order: 'asc' },
      ]);

    if (parentId === null) {
      query.whereNull('ParentId');
    } else {
      query.where({ ParentId: parentId });
    }

    const rows = await query.select<MenuRow[]>('*');
    return rows.map((row) => this.rowToEntity(row));
  }
}
