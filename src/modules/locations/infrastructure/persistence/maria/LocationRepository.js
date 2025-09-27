const knex = require('../../../../../shared/infrastructure/db/knex');

class LocationRepository {
  table() { return 'Locations'; }

  async findById(id) {
    return knex(this.table()).where({ Id: id, IsDeleted: 0 }).first();
  }

  async findByCode(code) {
    return knex(this.table()).where({ Code: code, IsDeleted: 0 }).first();
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
      Code: data.Code,
      Address: data.Address ?? null,
      City: data.City ?? null,
      CreatedBy: data.CreatedBy,
      IsCompanyOffice: data.IsCompanyOffice ?? 0,
      IsDeleted: data.IsDeleted ?? 0
    });
    return this.findById(id);
  }

  async update(id, patch) {
    const updateData = {
      ...(patch.Code !== undefined && { Code: patch.Code }),
      ...(patch.Address !== undefined && { Address: patch.Address }),
      ...(patch.City !== undefined && { City: patch.City }),
      ...(patch.CreatedBy !== undefined && { CreatedBy: patch.CreatedBy }),
      ...(patch.IsCompanyOffice !== undefined && { IsCompanyOffice: patch.IsCompanyOffice }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted })
    };
    await knex(this.table()).where({ Id: id }).update(updateData);
    return this.findById(id);
  }
}

module.exports = LocationRepository;