import knex from '../../../../../shared/infrastructure/db/knex';
import { Exit } from '../../../domain/entities/Exit';
import { IExitRepository } from '../../../domain/repositories/IExitRepository';

type TinyInt = 0 | 1;

interface ExitRow {
  Id: number;
  UserId: number;
  LocationId: number;
  ExitTime: string | null;
  EntryId: number;
  Result: string | null;
  IrregularBehavior: TinyInt;
  ReviewedByAdmin: TinyInt;
  UpdatedAt: string | null;
  IsSynced: TinyInt;
  DeviceId: string | null;
  IsDeleted: TinyInt;
}

export default class ExitRepositoryMaria implements IExitRepository {
  table(): string {
    return 'Exits';
  }
  
  private rowToEntity(row: ExitRow): Exit {
    return Exit.fromRow({
      Id: row.Id,
      UserId: row.UserId,
      LocationId: row.LocationId,
      ExitTime: row.ExitTime,
      EntryId: row.EntryId,
      Result: row.Result,
      IrregularBehavior: row.IrregularBehavior,
      ReviewedByAdmin: row.ReviewedByAdmin,
      UpdatedAt: row.UpdatedAt,
      IsSynced: row.IsSynced,
      DeviceId: row.DeviceId,
      IsDeleted: row.IsDeleted
    });
  }

  async findById(id: number): Promise<Exit | null> {
    const row = await knex<ExitRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .first();

    return row ? this.rowToEntity(row) : null;
  }

  async findByEntryId(entryId: number): Promise<Exit | null> {
    const row = await knex<ExitRow>(this.table())
      .where({ EntryId: entryId, IsDeleted: 0 })
      .orderBy('ExitTime', 'desc')
      .first();

    return row ? this.rowToEntity(row) : null;
  }

  async listPage(params: { page?: number; pageSize?: number } = {}): Promise<{ items: Exit[]; total: number }> {
    const { page = 1, pageSize = 50 } = params;

    const base = knex<ExitRow>(this.table()).where({ IsDeleted: 0 });

    const [{ count }] = await base.clone().count<{ count: string }>({ count: '*' });
    const rows = await base
      .clone()
      .orderBy('Id', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return {
      items: rows.map((row) => this.rowToEntity(row)),
      total: Number(count),
    };
  }

  async create(data: Exit): Promise<Exit> {
    const toInsert: Partial<ExitRow> = {
      UserId: data.UserId,
      LocationId: data.LocationId,
      ExitTime: Exit._toISO(data.ExitTime) ?? null,
      EntryId: data.EntryId,
      Result: data.Result ?? null,
      IrregularBehavior: data.IrregularBehavior ? 1 : 0,
      ReviewedByAdmin: data.ReviewedByAdmin ? 1 : 0,
      IsSynced: data.IsSynced ? 1 : 0,
      DeviceId: data.DeviceId ?? null,
      IsDeleted: 0,
    };

    const [id] = await knex<ExitRow>(this.table()).insert(toInsert);
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to fetch created Exit');
    return created;
  }

  async update(id: number, patch: Partial<Exit>): Promise<Exit> {
    const updateData: Partial<ExitRow> = {
      ...(patch.Result !== undefined && { Result: patch.Result }),
      ...(patch.IrregularBehavior !== undefined && { IrregularBehavior: patch.IrregularBehavior ? 1 : 0 }),
      ...(patch.ReviewedByAdmin !== undefined && { ReviewedByAdmin: patch.ReviewedByAdmin ? 1 : 0 }),
      ...(patch.IsSynced !== undefined && { IsSynced: patch.IsSynced ? 1 : 0 }),
      ...(patch.DeviceId !== undefined && { DeviceId: patch.DeviceId ?? null }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted ? 1 : 0 }),
      UpdatedAt: knex.fn.now() as unknown as string,
    };

    await knex<ExitRow>(this.table()).where({ Id: id }).update(updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Exit not found after update');
    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await knex<ExitRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .update({ IsDeleted: 1, UpdatedAt: knex.fn.now() as unknown as string });
  }
}