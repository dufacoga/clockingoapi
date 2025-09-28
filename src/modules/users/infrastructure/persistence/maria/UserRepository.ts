import knex from '../../../../../shared/infrastructure/db/knex';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

type TinyInt = 0 | 1;

interface UserRow {
  Id: number;
  Name: string;
  Phone: string | null;
  Username: string;
  AuthToken: string;
  RoleId: number;
  IsDeleted: TinyInt;
}

export default class UserRepositoryMaria implements IUserRepository {
  table(): string {
    return 'Users';
  }

  private rowToEntity(row: UserRow): User {
    return User.fromRow({
      Id: row.Id,
      Name: row.Name,
      Phone: row.Phone,
      Username: row.Username,
      AuthToken: row.AuthToken,
      RoleId: row.RoleId,
      IsDeleted: row.IsDeleted
    });
  }

  async findById(id: number): Promise<User | null> {
    const row = await knex<UserRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await knex<UserRow>(this.table())
      .where({ Username: username, IsDeleted: 0 })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async listPage(
    params: { page?: number; pageSize?: number } = {}
  ): Promise<{ items: User[]; total: number }> {
    const { page = 1, pageSize = 50 } = params;

    const base = knex<UserRow>(this.table()).where({ IsDeleted: 0 });
    const [{ count }] = await base.clone().count<{ count: string }>({ count: '*' });

    const rows = await base
      .clone()
      .orderBy('Id', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return { items: rows.map(r => this.rowToEntity(r)), total: Number(count) };
  }

  async create(data: User): Promise<User> {
    const toInsert: Partial<UserRow> = {
      Name: data.Name,
      Phone: data.Phone ?? null,
      Username: data.Username,
      AuthToken: data.AuthToken,
      RoleId: data.RoleId,
      IsDeleted: 0
    };

    const [id] = await knex<UserRow>(this.table()).insert(toInsert as any);
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to fetch created User');
    return created;
  }

  async update(id: number, patch: Partial<User>): Promise<User> {
    const updateData: Partial<UserRow> = {
      ...(patch.Name !== undefined && { Name: patch.Name }),
      ...(patch.Phone !== undefined && { Phone: patch.Phone ?? null }),
      ...(patch.Username !== undefined && { Username: patch.Username }),
      ...(patch.AuthToken !== undefined && { AuthToken: patch.AuthToken }),
      ...(patch.RoleId !== undefined && { RoleId: patch.RoleId }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted ? 1 : 0 })
    };

    await knex<UserRow>(this.table()).where({ Id: id }).update(updateData as any);
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await knex<UserRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .update({ IsDeleted: 1 });
  }
}