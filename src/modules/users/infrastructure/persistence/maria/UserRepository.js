const knex = require('../../../../../shared/infrastructure/db/knex');

class UserRepository {
  table() { return 'Users'; }

  async findById(id) {
    return knex(this.table()).where({ Id: id, IsDeleted: 0 }).first();
  }

  async findByUsername(username) {
    return knex(this.table()).where({ Username: username, IsDeleted: 0 }).first();
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
      Name: data.Name,
      Phone: data.Phone ?? null,
      Username: data.Username,
      AuthToken: data.AuthToken,
      RoleId: data.RoleId,
      IsDeleted: data.IsDeleted ?? 0
    });
    return this.findById(id);
  }

  async update(id, patch) {
    const updateData = {
      ...(patch.Name !== undefined && { Name: patch.Name }),
      ...(patch.Phone !== undefined && { Phone: patch.Phone }),
      ...(patch.Username !== undefined && { Username: patch.Username }),
      ...(patch.AuthToken !== undefined && { AuthToken: patch.AuthToken }),
      ...(patch.RoleId !== undefined && { RoleId: patch.RoleId }),
      ...(patch.IsDeleted !== undefined && { IsDeleted: patch.IsDeleted })
    };
    await knex(this.table()).where({ Id: id }).update(updateData);
    return this.findById(id);
  }
}

module.exports = UserRepository;
