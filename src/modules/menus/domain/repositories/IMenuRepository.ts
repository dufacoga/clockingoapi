import { Menu } from '../entities/Menu';

export interface IMenuRepository {
  findById(id: number): Promise<Menu | null>;
  findByNames(
    params: { nameEs: string; nameEn: string; parentId: number | null }
  ): Promise<Menu | null>;
  listPage(params: { page?: number; pageSize?: number }): Promise<{ items: Menu[]; total: number }>;
  create(data: Menu): Promise<Menu>;
  update(id: number, patch: Partial<Menu>): Promise<Menu>;
  softDelete(id: number): Promise<boolean>;
  listByRole(roleId: number): Promise<Menu[]>;
  listByParentId(parentId: number | null): Promise<Menu[]>;
}
