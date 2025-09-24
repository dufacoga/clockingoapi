const { BaseEntity } = require('../../../../shared/domain/BaseEntity');

class Location extends BaseEntity {
  constructor({
    Id = null,
    Code,
    Address = null,
    City = null,
    CreatedBy,
    IsCompanyOffice = false,
    IsDeleted = false,
  }) {
    super();
    this.Id = Id;
    this.Code = Code;
    this.Address = Address;
    this.City = City;
    this.CreatedBy = CreatedBy;
    this.IsCompanyOffice = !!IsCompanyOffice;
    this.IsDeleted = !!IsDeleted;
  }

  static get tableName() { return 'Locations'; }
  static get columns() {
    return ['Id', 'Code', 'Address', 'City', 'CreatedBy', 'IsCompanyOffice', 'IsDeleted'];
  }

  static fromRow(row = {}) {
    return new Location({
      Id: row.Id ?? null,
      Code: row.Code ?? null,
      Address: row.Address ?? null,
      City: row.City ?? null,
      CreatedBy: row.CreatedBy ?? null,
      IsCompanyOffice: row.IsCompanyOffice ?? false,
      IsDeleted: row.IsDeleted ?? false,
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      Code: this.Code,
      Address: this.Address,
      City: this.City,
      CreatedBy: this.CreatedBy,
      IsCompanyOffice: this.IsCompanyOffice ? 1 : 0,
      IsDeleted: this.IsDeleted ? 1 : 0,
    };
  }
}

module.exports = { Location };