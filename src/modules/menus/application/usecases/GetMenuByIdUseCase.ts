import { IMenuRepository } from '../../domain/repositories/IMenuRepository';

export default class GetMenuByIdUseCase {
  private menuRepo: IMenuRepository;

  constructor({ menuRepo }: { menuRepo: IMenuRepository }) {
    this.menuRepo = menuRepo;
  }

  private buildError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
  }

  async execute(id: number) {
    const menu = await this.menuRepo.findById(id);
    if (!menu) {
      throw this.buildError('MENU_NOT_FOUND', 404);
    }

    return menu;
  }
}
