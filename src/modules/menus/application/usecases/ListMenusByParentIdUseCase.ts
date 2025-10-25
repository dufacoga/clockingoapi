import { IMenuRepository } from '../../domain/repositories/IMenuRepository';

export default class ListMenusByParentIdUseCase {
  private menuRepo: IMenuRepository;

  constructor({ menuRepo }: { menuRepo: IMenuRepository }) {
    this.menuRepo = menuRepo;
  }

  async execute(parentId: number | null) {
    return this.menuRepo.listByParentId(parentId);
  }
}
