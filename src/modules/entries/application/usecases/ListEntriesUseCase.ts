import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { Entry } from '../../domain/entities/Entry';

interface Params {
  page?: number;
  pageSize?: number;
}

export default class ListEntriesUseCase {
  constructor(private deps: { entryRepo: IEntryRepository }) {}

  async execute({ page = 1, pageSize = 50 }: Params): Promise<{ items: Entry[]; total: number; page: number; pageSize: number }> {
    const { entryRepo } = this.deps;
    const { items, total } = await entryRepo.listPage({ page, pageSize });
    return { items, total, page, pageSize };
  }
}