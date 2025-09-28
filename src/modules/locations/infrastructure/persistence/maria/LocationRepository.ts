import knex from '../../../../../shared/infrastructure/db/knex';
import { Location } from '../../../domain/entities/Location';
import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';

type TinyInt = 0 | 1;

interface LocationRow {
  Id: number;
  Code: string;
  Address: string | null;
  City: string | null;
  CreatedBy: number;
  IsCompanyOffice: TinyInt;
  IsDeleted: TinyInt;
}

export default class LocationRepositoryMaria implements ILocationRepository {
  table(): string {
    return 'Locations';
  }

  private rowToEntity(row: LocationRow): Location {
    return Location.fromRow({
      Id: row.Id,
      Code: row.Code,
      Address: row.Address,
      City: row.City,
      CreatedBy: row.CreatedBy,
      IsCompanyOffice: row.IsCompanyOffice,
      IsDeleted: row.IsDeleted,
    });
  }

  async findById(id: number): Promise<Location | null> {
    const row = await knex<LocationRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async findByCode(code: string): Promise<Location | null> {
    const row = await knex<LocationRow>(this.table())
      .where({ Code: code, IsDeleted: 0 })
      .first();
    return row ? this.rowToEntity(row) : null;
  }

  async listPage(
    params: { page?: number; pageSize?: number } = {}
  ): Promise<{ items: Location[]; total: number }> {
    const { page = 1, pageSize = 50 } = params;

    const base = knex<LocationRow>(this.table()).where({ IsDeleted: 0 });
    const [{ count }] = await base.clone().count<{ count: string }>({ count: '*' });

    const rows = await base
      .clone()
      .orderBy('Id', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return { items: rows.map(r => this.rowToEntity(r)), total: Number(count) };
  }

  async create(data: Location): Promise<Location> {
    const toInsert: Partial<LocationRow> = {
      Code: data.Code,
      Address: data.Address ?? null,
      City: data.City ?? null,
      CreatedBy: data.CreatedBy,
      IsCompanyOffice: data.IsCompanyOffice ? 1 : 0,
      IsDeleted: 0,
    };

    const [id] = await knex<LocationRow>(this.table()).insert(toInsert as any);
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to fetch created Location');
    return created;
  }

  async update(id: number, patch: Partial<Location>): Promise<Location> {
    const updateData: Partial<LocationRow> = {
      ...(patch.Code !== undefined && { Code: patch.Code }),
      ...(patch.Address !== undefined && { Address: patch.Address ?? null }),
      ...(patch.City !== undefined && { City: patch.City ?? null }),
      ...(patch.CreatedBy !== undefined && { CreatedBy: patch.CreatedBy }),
      ...(patch.IsCompanyOffice !== undefined && { IsCompanyOffice: patch.IsCompanyOffice ? 1 : 0 }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted ? 1 : 0 })
    };

    await knex<LocationRow>(this.table()).where({ Id: id }).update(updateData as any);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Location not found after update');
    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await knex<LocationRow>(this.table())
      .where({ Id: id, IsDeleted: 0 })
      .update({ IsDeleted: 1 });
  }
}