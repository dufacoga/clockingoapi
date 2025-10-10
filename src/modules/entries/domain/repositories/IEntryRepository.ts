import { Entry } from '../../domain/entities/Entry';

export interface IEntryRepository {
  findById(id: number): Promise<Entry | null>;
  findLastByUser(userId: number): Promise<Entry | null>;
  create(entry: Entry): Promise<Entry>;
  update(id: number, patch: Partial<Entry>): Promise<Entry>;
  softDelete(id: number): Promise<boolean>;
  listPage(params: { page?: number; pageSize?: number }): Promise<{ items: Entry[]; total: number }>;
}