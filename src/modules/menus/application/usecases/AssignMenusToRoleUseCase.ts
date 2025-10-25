import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { IMenuRoleRepository } from '../../domain/repositories/IMenuRoleRepository';
import { IRoleRepository } from '../../../users/domain/repositories/IRoleRepository';

export default class AssignMenusToRoleUseCase {
  private menuRepo: IMenuRepository;
  private menuRoleRepo: IMenuRoleRepository;
  private roleRepo: IRoleRepository;

  constructor({
    menuRepo,
    menuRoleRepo,
    roleRepo,
  }: {
    menuRepo: IMenuRepository;
    menuRoleRepo: IMenuRoleRepository;
    roleRepo: IRoleRepository;
  }) {
    this.menuRepo = menuRepo;
    this.menuRoleRepo = menuRoleRepo;
    this.roleRepo = roleRepo;
  }

  private buildError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
  }

  async execute(roleId: number, menuIds: number[]) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) {
      throw this.buildError('ROLE_NOT_FOUND', 404);
    }

    const uniqueMenuIds = [...new Set(menuIds)];

    await Promise.all(
      uniqueMenuIds.map(async (menuId) => {
        const menu = await this.menuRepo.findById(menuId);
        if (!menu) {
          throw this.buildError('MENU_NOT_FOUND', 404);
        }
      })
    );

    await this.menuRoleRepo.replaceRoleMenus(roleId, uniqueMenuIds);
  }
}
