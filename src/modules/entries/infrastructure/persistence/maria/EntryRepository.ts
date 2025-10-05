import knex from '../../../../../shared/infrastructure/db/knex';
import { Entry } from '../../../domain/entities/Entry';
import { IEntryRepository } from '../../../domain/repositories/IEntryRepository';

type TinyInt = 0 | 1;

interface EntryRow {
  Id: number;
  UserId: number;
  LocationId: number;
  EntryTime: string | null;
  Selfie: Buffer | null;
  UpdatedAt: string | null;
  IsSynced: TinyInt;
  DeviceId: string | null;
  IsDeleted: TinyInt;
}

export default class EntryRepositoryMaria implements IEntryRepository {
  table(): string {
    return 'Entries';
  }
  
  private rowToEntity(row: EntryRow): Entry {
    return Entry.fromRow({
      Id: row.Id,
      UserId: row.UserId,
      LocationId: row.LocationId,
      EntryTime: row.EntryTime,
      Selfie: row.Selfie,
      UpdatedAt: row.UpdatedAt,
      IsSynced: row.IsSynced,
      DeviceId: row.DeviceId,
      IsDeleted: row.IsDeleted
    });
  }

  async findById(id: number): Promise<Entry | null> {
    const row = await knex<EntryRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .first();

    return row ? this.rowToEntity(row) : null;
  }

  async findLastByUser(userId: number): Promise<Entry | null> {
    const row = await knex<EntryRow>(this.table())
      .where({ UserId: userId, IsDeleted: 0 })
      .orderBy('EntryTime', 'desc')
      .first();

    return row ? this.rowToEntity(row) : null;
  }

  async listPage(params: { page?: number; pageSize?: number } = {}): Promise<{ items: Entry[]; total: number }> {
    const { page = 1, pageSize = 50 } = params;

    const base = knex<EntryRow>(this.table()).where({ IsDeleted: 0 });

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

  async create(data: Entry): Promise<Entry> {
    const toInsert: Partial<EntryRow> = {
      UserId: data.UserId,
      LocationId: data.LocationId,
      EntryTime: Entry._toISO(data.EntryTime) ?? null,
      Selfie: data.Selfie ?? null,
      IsSynced: data.IsSynced ? 1 : 0,
      DeviceId: data.DeviceId ?? null,
      IsDeleted: 0,
    };

    const [id] = await knex<EntryRow>(this.table()).insert(toInsert);
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to fetch created Entry');
    return created;
  }

  async update(id: number, patch: Partial<Entry>): Promise<Entry> {
    const updateData: Partial<EntryRow> = {
      ...(patch.UserId !== undefined && { UserId: patch.UserId }),
      ...(patch.LocationId !== undefined && { LocationId: patch.LocationId }),
      ...(patch.EntryTime !== undefined && {
        EntryTime: Entry._toISO(patch.EntryTime ?? null) ?? null,
      }),
      ...(patch.Selfie !== undefined && { Selfie: patch.Selfie ?? null }),
      ...(patch.IsSynced !== undefined && { IsSynced: patch.IsSynced ? 1 : 0 }),
      ...(patch.DeviceId !== undefined && { DeviceId: patch.DeviceId ?? null }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted ? 1 : 0 }),
      UpdatedAt: knex.fn.now() as unknown as string,
    };

    await knex<EntryRow>(this.table()).where({ Id: id }).update(updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Entry not found after update');
    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await knex<EntryRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .update({ IsDeleted: 1, UpdatedAt: knex.fn.now() as unknown as string });
  }
}