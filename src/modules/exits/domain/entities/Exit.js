const { BaseEntity } = require('../../../../shared/domain/BaseEntity');

class Exit extends BaseEntity {
  constructor({
    Id = null,
    UserId,
    LocationId,
    ExitTime,
    EntryId,
    Result = null,
    IrregularBehavior = false,
    ReviewedByAdmin = false,
    UpdatedAt = null,
    IsSynced = false,
    DeviceId = null,
  }) {
    super();
    this.Id = Id;
    this.UserId = UserId;
    this.LocationId = LocationId;
    this.ExitTime = ExitTime ? BaseEntity._toDate(ExitTime) : null;
    this.EntryId = EntryId;
    this.Result = Result;
    this.IrregularBehavior = !!IrregularBehavior;
    this.ReviewedByAdmin = !!ReviewedByAdmin;
    this.UpdatedAt = UpdatedAt ? BaseEntity._toDate(UpdatedAt) : null;
    this.IsSynced = !!IsSynced;
    this.DeviceId = DeviceId;
  }

  static get tableName() { return 'Exits'; }
  static get columns() {
    return [
      'Id', 'UserId', 'LocationId', 'ExitTime', 'EntryId', 'Result',
      'IrregularBehavior', 'ReviewedByAdmin', 'UpdatedAt', 'IsSynced', 'DeviceId'
    ];
  }

  static fromRow(row = {}) {
    return new Exit({
      Id: row.Id ?? null,
      UserId: row.UserId ?? null,
      LocationId: row.LocationId ?? null,
      ExitTime: row.ExitTime ?? null,
      EntryId: row.EntryId ?? null,
      Result: row.Result ?? null,
      IrregularBehavior: this._toBool(row.IrregularBehavior),
      ReviewedByAdmin: this._toBool(row.ReviewedByAdmin),
      UpdatedAt: row.UpdatedAt ?? null,
      IsSynced: this._toBool(row.IsSynced),
      DeviceId: row.DeviceId ?? null,
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      UserId: this.UserId,
      LocationId: this.LocationId,
      ExitTime: this.constructor._toISO(this.ExitTime),
      EntryId: this.EntryId,
      Result: this.Result,
      IrregularBehavior: this.constructor._fromBool(this.IrregularBehavior),
      ReviewedByAdmin: this.constructor._fromBool(this.ReviewedByAdmin),
      UpdatedAt: this.constructor._toISO(this.UpdatedAt),
      IsSynced: this.constructor._fromBool(this.IsSynced),
      DeviceId: this.DeviceId,
    };
  }
}

module.exports = { Exit };