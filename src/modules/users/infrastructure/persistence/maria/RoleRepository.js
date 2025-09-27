const knex = require('../../../../../shared/infrastructure/db/knex');

class RoleRepository {
  table() { return 'Roles'; }

  async findById(id) {
    return knex(this.table()).where({ Id: id }).first();
  }

  async findByName(name) {
    return knex(this.table()).where({ Name: name }).first();
  }

  async create(data) {
    const [id] = await knex(this.table()).insert({ Name: data.Name });
    return this.findById(id);
  }
}

module.exports = RoleRepository;