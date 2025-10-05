import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

interface ListUsersParams {
  page?: number;
  pageSize?: number;
}

export default class ListUsersUseCase {
  constructor(private deps: { userRepo: IUserRepository }) {}

  async execute({ page = 1, pageSize = 50 }: ListUsersParams): Promise<{
    items: User[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total } = await this.deps.userRepo.listPage({ page, pageSize });
    return { items, total, page, pageSize };
  }
}