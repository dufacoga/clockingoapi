const { BaseEntity } = require('../../../../shared/domain/BaseEntity');

class User extends BaseEntity {
  constructor({
    Id = null, 
    Name, 
    Phone = null, 
    Username, 
    AuthToken, 
    RoleId, 
    IsDeleted = false 
  }) {
    super();
    this.Id = Id;
    this.Name = Name;
    this.Phone = Phone;
    this.Username = Username;
    this.AuthToken = AuthToken;
    this.RoleId = RoleId;
    this.IsDeleted = !!IsDeleted;
  }

  static get tableName() { return 'Users'; }
  static get columns() {
    return ['Id', 'Name', 'Phone', 'Username', 'AuthToken', 'RoleId', 'IsDeleted'];
  }

  static fromRow(row = {}) {
    return new User({
      Id: row.Id ?? null,
      Name: row.Name ?? null,
      Phone: row.Phone ?? null,
      Username: row.Username ?? null,
      AuthToken: row.AuthToken ?? null,
      RoleId: row.RoleId ?? null,
      IsDeleted: row.IsDeleted ?? false,
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      Name: this.Name,
      Phone: this.Phone,
      Username: this.Username,
      AuthToken: this.AuthToken,
      RoleId: this.RoleId,
      IsDeleted: this.IsDeleted ? 1 : 0,
    };
  }
}

module.exports = { User };