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
    IsDeleted = false,
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
    this.IsDeleted = !!IsDeleted;
  }

  static get tableName() { return 'Exits'; }
  static get columns() {
    return [
      'Id', 'UserId', 'LocationId', 'ExitTime', 'EntryId', 'Result',
      'IrregularBehavior', 'ReviewedByAdmin', 'UpdatedAt', 'IsSynced', 'DeviceId', 'IsDeleted'
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
      IrregularBehavior: row.IrregularBehavior ?? false,
      ReviewedByAdmin: row.ReviewedByAdmin ?? false,
      UpdatedAt: row.UpdatedAt ?? null,
      IsSynced: row.IsSynced ?? false,
      DeviceId: row.DeviceId ?? null,
      IsDeleted: row.IsDeleted ?? false,
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
      IrregularBehavior: this.IrregularBehavior ? 1 : 0,
      ReviewedByAdmin: this.ReviewedByAdmin ? 1 : 0,
      UpdatedAt: this.constructor._toISO(this.UpdatedAt),
      IsSynced: this.IsSynced ? 1 : 0,
      DeviceId: this.DeviceId,
      IsDeleted: this.IsDeleted ? 1 : 0,
    };
  }
}

module.exports = { Exit };