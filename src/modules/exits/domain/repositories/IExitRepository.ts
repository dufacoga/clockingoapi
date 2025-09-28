import { Exit } from '../../domain/entities/Exit';

export interface IExitRepository {
  findById(id: number): Promise<Exit | null>;
  findByEntryId(entryId: number): Promise<Exit | null>;
  create(exit: Exit): Promise<Exit>;
  update(id: number, data: Partial<Exit>): Promise<Exit>;
  softDelete(id: number): Promise<void>;
  listPage(params: { page?: number; pageSize?: number }): Promise<{ items: Exit[]; total: number }>;
}
