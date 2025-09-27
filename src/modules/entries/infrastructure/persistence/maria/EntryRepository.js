const knex = require('../../../../../shared/infrastructure/db/knex');

class EntryRepository {
  table() { return 'Entries'; }

  async findById(id) {
    return knex(this.table()).where({ Id: id, IsDeleted: 0 }).first();
  }

  async findLastByUser(userId) {
    return knex(this.table())
      .where({ UserId: userId, IsDeleted: 0 })
      .orderBy('EntryTime', 'desc')
      .first();
  }

  async listPage({ page = 1, pageSize = 50 } = {}) {
    const base = knex(this.table()).where({ IsDeleted: 0 });
    const [{ count }] = await base.clone().count({ count: '*' });
    const items = await base
      .clone()
      .orderBy('Id', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return { items, total: Number(count) };
  }

  async create(data) {
    const [id] = await knex(this.table()).insert({
      UserId: data.UserId,
      LocationId: data.LocationId,
      EntryTime: data.EntryTime,
      Selfie: data.Selfie ?? null,
      IsSynced: data.IsSynced ?? 0,
      DeviceId: data.DeviceId ?? null,
      IsDeleted: 0
    });
    return this.findById(id);
  }

  async update(id, patch) {
    const updateData = {
      ...(patch.UserId !== undefined && { UserId: patch.UserId }),
      ...(patch.LocationId !== undefined && { LocationId: patch.LocationId }),
      ...(patch.EntryTime !== undefined && { EntryTime: patch.EntryTime }),
      ...(patch.Selfie !== undefined && { Selfie: patch.Selfie }),
      ...(patch.IsSynced !== undefined && { IsSynced: patch.IsSynced }),
      ...(patch.DeviceId !== undefined && { DeviceId: patch.DeviceId }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted }),
      UpdatedAt: knex.fn.now()
    };
    await knex(this.table()).where({ Id: id }).update(updateData);
    return this.findById(id);
  }
}

module.exports = EntryRepository;