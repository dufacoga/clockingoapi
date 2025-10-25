import knex from '../../../../../shared/infrastructure/db/knex';
import { IMenuRoleRepository } from '../../../domain/repositories/IMenuRoleRepository';

interface MenuRoleRow {
  RoleId: number;
  MenuId: number;
}

export default class MenuRoleRepositoryMaria implements IMenuRoleRepository {
  table(): string {
    return 'MenuRoles';
  }

  async listRoleMenuIds(roleId: number): Promise<number[]> {
    const rows = await knex<MenuRoleRow>(this.table()).where({ RoleId: roleId });
    return rows.map((row) => row.MenuId);
  }

  async replaceRoleMenus(roleId: number, menuIds: number[]): Promise<void> {
    const uniqueMenuIds = [...new Set(menuIds)];

    await knex.transaction(async (trx) => {
      await trx<MenuRoleRow>(this.table()).where({ RoleId: roleId }).delete();

      if (uniqueMenuIds.length === 0) return;

      const rows = uniqueMenuIds.map((menuId) => ({ RoleId: roleId, MenuId: menuId }));
      await trx<MenuRoleRow>(this.table()).insert(rows);
    });
  }

  async removeByMenu(menuId: number): Promise<void> {
    await knex<MenuRoleRow>(this.table()).where({ MenuId: menuId }).delete();
  }
}
