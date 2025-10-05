import { IRoleRepository } from '../../domain/repositories/IRoleRepository';
import { Role } from '../../domain/entities/Role';

interface ListRolesParams {
  page?: number;
  pageSize?: number;
}

export default class ListRolesUseCase {
  constructor(private deps: { roleRepo: IRoleRepository }) {}

  async execute({ page = 1, pageSize = 50 }: ListRolesParams): Promise<{
    items: Role[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total } = await this.deps.roleRepo.listPage({ page, pageSize });
    return { items, total, page, pageSize };
  }
}