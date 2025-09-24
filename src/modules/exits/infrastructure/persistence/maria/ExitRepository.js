const knex = require('../../../../../../shared/infrastructure/db/knex');

class ExitRepository {
  table() { return 'Exits'; }

  async findById(id) {
    return knex(this.table()).where({ Id: id, IsDeleted: 0 }).first();
  }

  async findByEntryId(entryId) {
    return knex(this.table())
      .where({ EntryId: entryId, IsDeleted: 0 })
      .orderBy('ExitTime', 'desc')
      .first();
  }

  async create(data) {
    const [id] = await knex(this.table()).insert({
      UserId: data.UserId,
      LocationId: data.LocationId,
      ExitTime: data.ExitTime,
      EntryId: data.EntryId,
      Result: data.Result ?? null,
      IrregularBehavior: data.IrregularBehavior ?? 0,
      ReviewedByAdmin: data.ReviewedByAdmin ?? 0,
      IsSynced: data.IsSynced ?? 0,
      DeviceId: data.DeviceId ?? null,
      IsDeleted: 0
    });
    return this.findById(id);
  }

  async update(id, patch) {
    const updateData = {
      ...(patch.Result !== undefined && { Result: patch.Result }),
      ...(patch.IrregularBehavior !== undefined && { IrregularBehavior: patch.IrregularBehavior }),
      ...(patch.ReviewedByAdmin !== undefined && { ReviewedByAdmin: patch.ReviewedByAdmin }),
      ...(patch.IsSynced !== undefined && { IsSynced: patch.IsSynced }),
      ...(patch.DeviceId !== undefined && { DeviceId: patch.DeviceId }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted }),
      UpdatedAt: knex.fn.now()
    };
    await knex(this.table()).where({ Id: id }).update(updateData);
    return this.findById(id);
  }
}

module.exports = ExitRepository;