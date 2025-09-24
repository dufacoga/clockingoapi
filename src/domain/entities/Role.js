const { BaseEntity } = require('./BaseEntity');

class Role extends BaseEntity {
  constructor({ Id = null, Name }) {
    super();
    this.Id = Id;
    this.Name = Name;
  }

  static get tableName() { return 'Roles'; }
  static get columns() { 
    return ['Id', 'Name'];
  }

  static fromRow(row = {}) {
    return new Role({
      Id: row.Id ?? null,
      Name: row.Name ?? null,
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      Name: this.Name,
    };
  }
}

module.exports = { Role };