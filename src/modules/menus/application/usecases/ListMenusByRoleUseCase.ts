import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { IRoleRepository } from '../../../users/domain/repositories/IRoleRepository';

export default class ListMenusByRoleUseCase {
  private menuRepo: IMenuRepository;
  private roleRepo: IRoleRepository;

  constructor({ menuRepo, roleRepo }: { menuRepo: IMenuRepository; roleRepo: IRoleRepository }) {
    this.menuRepo = menuRepo;
    this.roleRepo = roleRepo;
  }

  private buildError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
  }

  async execute(roleId: number) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) {
      throw this.buildError('ROLE_NOT_FOUND', 404);
    }

    return this.menuRepo.listByRole(roleId);
  }
}
