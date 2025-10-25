import { IMenuRepository } from '../../domain/repositories/IMenuRepository';

interface ListMenusInput {
  page?: number;
  pageSize?: number;
}

export default class ListMenusUseCase {
  private menuRepo: IMenuRepository;

  constructor({ menuRepo }: { menuRepo: IMenuRepository }) {
    this.menuRepo = menuRepo;
  }

  async execute({ page = 1, pageSize = 50 }: ListMenusInput = {}) {
    const { items, total } = await this.menuRepo.listPage({ page, pageSize });

    return {
      items,
      page,
      pageSize,
      total,
    };
  }
}
