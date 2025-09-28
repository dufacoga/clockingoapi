import knex from '../../../../../shared/infrastructure/db/knex';
import { Role } from '../../../domain/entities/Role';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';

interface RoleRow {
  Id: number;
  Name: string;
}

export default class RoleRepositoryMaria implements IRoleRepository {
  private table(): string {
    return 'Roles';
  }

  private rowToEntity(row: RoleRow): Role {
    return Role.fromRow({
      Id: row.Id,
      Name: row.Name,
    });
  }

  async findById(id: number): Promise<Role | null> {
    const row = await knex<RoleRow>(this.table())
      .where({ Id: id })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const row = await knex<RoleRow>(this.table())
      .where({ Name: name })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async create(role: Role): Promise<Role> {
    const [id] = await knex<RoleRow>(this.table()).insert({ Name: role.Name } as any);
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to fetch created Role');
    return created;
  }
  
  async listPage(params: { page?: number; pageSize?: number } = {}): Promise<{ items: Role[]; total: number }> {
    const { page = 1, pageSize = 50 } = params;

    const base = knex<RoleRow>(this.table());
    const [{ count }] = await base.clone().count<{ count: string }>({ count: '*' });

    const rows = await base
      .clone()
      .orderBy('Id', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return {
      items: rows.map(r => this.rowToEntity(r)),
      total: Number(count),
    };
  }
}