import { IExitRepository } from '../../domain/repositories/IExitRepository';
import { Exit } from '../../domain/entities/Exit';

interface ListExitsParams {
  page?: number;
  pageSize?: number;
}

export default class ListExitsUseCase {
  constructor(private deps: { exitRepo: IExitRepository }) {}

  async execute({ page = 1, pageSize = 50 }: ListExitsParams): Promise<{
    items: Exit[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total } = await this.deps.exitRepo.listPage({ page, pageSize });
    return { items, total, page, pageSize };
  }
}