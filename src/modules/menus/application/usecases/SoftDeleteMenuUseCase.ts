import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { IMenuRoleRepository } from '../../domain/repositories/IMenuRoleRepository';

export default class SoftDeleteMenuUseCase {
  private menuRepo: IMenuRepository;
  private menuRoleRepo: IMenuRoleRepository;

  constructor({ menuRepo, menuRoleRepo }: { menuRepo: IMenuRepository; menuRoleRepo: IMenuRoleRepository }) {
    this.menuRepo = menuRepo;
    this.menuRoleRepo = menuRoleRepo;
  }

  private buildError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
  }

  async execute(id: number) {
    const existing = await this.menuRepo.findById(id);
    if (!existing) {
      throw this.buildError('MENU_NOT_FOUND', 404);
    }

    const deleted = await this.menuRepo.softDelete(id);
    if (deleted) {
      await this.menuRoleRepo.removeByMenu(id);
    }
  }
}
