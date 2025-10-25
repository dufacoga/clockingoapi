import MenuRepositoryMaria from '../../infrastructure/persistence/maria/MenuRepository';
import MenuRoleRepositoryMaria from '../../infrastructure/persistence/maria/MenuRoleRepository';

import CreateMenuUseCase from '../../application/usecases/CreateMenuUseCase';
import GetMenuByIdUseCase from '../../application/usecases/GetMenuByIdUseCase';
import ListMenusUseCase from '../../application/usecases/ListMenusUseCase';
import ListMenusByParentIdUseCase from '../../application/usecases/ListMenusByParentIdUseCase';
import UpdateMenuUseCase from '../../application/usecases/UpdateMenuUseCase';
import SoftDeleteMenuUseCase from '../../application/usecases/SoftDeleteMenuUseCase';
import AssignMenusToRoleUseCase from '../../application/usecases/AssignMenusToRoleUseCase';
import ListMenusByRoleUseCase from '../../application/usecases/ListMenusByRoleUseCase';

import { IRoleRepository } from '../../../users/domain/repositories/IRoleRepository';

export interface MenuUC {
  createMenu: CreateMenuUseCase;
  getMenuById: GetMenuByIdUseCase;
  listMenus: ListMenusUseCase;
  listMenusByParentId: ListMenusByParentIdUseCase;
  updateMenu: UpdateMenuUseCase;
  softDeleteMenu: SoftDeleteMenuUseCase;
  assignMenusToRole: AssignMenusToRoleUseCase;
  listMenusByRole: ListMenusByRoleUseCase;
  menuRepo: MenuRepositoryMaria;
  menuRoleRepo: MenuRoleRepositoryMaria;
}

interface MenuBuildDeps {
  roleRepo: IRoleRepository;
}

export default function buildMenus({ roleRepo }: MenuBuildDeps): MenuUC {
  const menuRepo = new MenuRepositoryMaria();
  const menuRoleRepo = new MenuRoleRepositoryMaria();

  return {
    createMenu: new CreateMenuUseCase({ menuRepo }),
    getMenuById: new GetMenuByIdUseCase({ menuRepo }),
    listMenus: new ListMenusUseCase({ menuRepo }),
    listMenusByParentId: new ListMenusByParentIdUseCase({ menuRepo }),
    updateMenu: new UpdateMenuUseCase({ menuRepo }),
    softDeleteMenu: new SoftDeleteMenuUseCase({ menuRepo, menuRoleRepo }),
    assignMenusToRole: new AssignMenusToRoleUseCase({ menuRepo, menuRoleRepo, roleRepo }),
    listMenusByRole: new ListMenusByRoleUseCase({ menuRepo, roleRepo }),
    menuRepo,
    menuRoleRepo,
  };
}
