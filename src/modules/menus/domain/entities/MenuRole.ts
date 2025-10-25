export interface MenuRoleProps {
  RoleId: number;
  MenuId: number;
}

export class MenuRole {
  RoleId: number;
  MenuId: number;

  constructor({ RoleId, MenuId }: MenuRoleProps) {
    this.RoleId = RoleId;
    this.MenuId = MenuId;
  }
}
