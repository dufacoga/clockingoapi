export interface IMenuRoleRepository {
  listRoleMenuIds(roleId: number): Promise<number[]>;
  replaceRoleMenus(roleId: number, menuIds: number[]): Promise<void>;
  removeByMenu(menuId: number): Promise<void>;
}
