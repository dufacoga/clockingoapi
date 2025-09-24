const { BaseEntity } = require('../../../../shared/domain/BaseEntity');

class Entry extends BaseEntity {
  constructor({
    Id = null,
    UserId,
    LocationId,
    EntryTime,
    Selfie = null,
    UpdatedAt = null,
    IsSynced = false,
    DeviceId = null,
  }) {
    super();
    this.Id = Id;
    this.UserId = UserId;
    this.LocationId = LocationId;
    this.EntryTime = EntryTime ? BaseEntity._toDate(EntryTime) : null;
    this.Selfie = Selfie instanceof Buffer || Selfie === null ? Selfie : null;
    this.UpdatedAt = UpdatedAt ? BaseEntity._toDate(UpdatedAt) : null;
    this.IsSynced = !!IsSynced;
    this.DeviceId = DeviceId;
  }

  static get tableName() { return 'Entries'; }
  static get columns() {
    return [
      'Id', 'UserId', 'LocationId', 'EntryTime', 'Selfie',
      'UpdatedAt', 'IsSynced', 'DeviceId'
    ];
  }

  static fromRow(row = {}) {
    return new Entry({
      Id: row.Id ?? null,
      UserId: row.UserId ?? null,
      LocationId: row.LocationId ?? null,
      EntryTime: row.EntryTime ?? null,
      Selfie: row.Selfie ?? null,
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
      EntryTime: this.constructor._toISO(this.EntryTime),
      Selfie: this.Selfie,
      UpdatedAt: this.constructor._toISO(this.UpdatedAt),
      IsSynced: this.constructor._fromBool(this.IsSynced),
      DeviceId: this.DeviceId,
    };
  }
}

module.exports = { Entry };