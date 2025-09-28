import { User } from '../../domain/entities/User';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  softDelete(id: number): Promise<void>;
  listPage(params: { page?: number; pageSize?: number }): Promise<{ items: User[]; total: number }>;
}