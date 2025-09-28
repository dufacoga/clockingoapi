import { Role } from '../entities/Role';

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  listPage(params: { page?: number; pageSize?: number }): Promise<{ items: Role[]; total: number }>;
}