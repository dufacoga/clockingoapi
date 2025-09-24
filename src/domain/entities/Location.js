const { BaseEntity } = require('./BaseEntity');

class Location extends BaseEntity {
  constructor({
    Id = null,
    Code,
    Address = null,
    City = null,
    CreatedBy,
    IsCompanyOffice = false,
  }) {
    super();
    this.Id = Id;
    this.Code = Code;
    this.Address = Address;
    this.City = City;
    this.CreatedBy = CreatedBy;
    this.IsCompanyOffice = !!IsCompanyOffice;
  }

  static get tableName() { return 'Locations'; }
  static get columns() {
    return ['Id', 'Code', 'Address', 'City', 'CreatedBy', 'IsCompanyOffice'];
  }

  static fromRow(row = {}) {
    return new Location({
      Id: row.Id ?? null,
      Code: row.Code ?? null,
      Address: row.Address ?? null,
      City: row.City ?? null,
      CreatedBy: row.CreatedBy ?? null,
      IsCompanyOffice: this._toBool(row.IsCompanyOffice),
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      Code: this.Code,
      Address: this.Address,
      City: this.City,
      CreatedBy: this.CreatedBy,
      IsCompanyOffice: this.constructor._fromBool(this.IsCompanyOffice),
    };
  }
}

module.exports = { Location };