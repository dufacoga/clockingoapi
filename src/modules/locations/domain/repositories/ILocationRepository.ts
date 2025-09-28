import { Location } from '../../domain/entities/Location';

export interface ILocationRepository {
  findById(id: number): Promise<Location | null>;
  findByCode(code: string): Promise<Location | null>;
  create(location: Location): Promise<Location>;
  update(id: number, patch: Partial<Location>): Promise<Location>;
  softDelete(id: number): Promise<void>;
  listPage(params: { page?: number; pageSize?: number }): Promise<{ items: Location[]; total: number }>;
}