import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface EntryProps {
  Id?: number | null;
  UserId: number;
  LocationId: number;
  EntryTime?: Date | string | null;
  Selfie?: Buffer | null;
  UpdatedAt?: Date | string | null;
  IsSynced?: boolean | number;
  DeviceId?: string | null;
  IsDeleted?: boolean | number;
}

export class Entry extends BaseEntity {
  Id: number | null;
  UserId: number;
  LocationId: number;
  EntryTime: Date | null;
  Selfie: Buffer | null;
  UpdatedAt: Date | null;
  IsSynced: boolean;
  DeviceId: string | null;
  IsDeleted: boolean;

  constructor({
    Id = null,
    UserId,
    LocationId,
    EntryTime = null,
    Selfie = null,
    UpdatedAt = null,
    IsSynced = false,
    DeviceId = null,
    IsDeleted = false,
  }: EntryProps) {
    super();
    this.Id = Id;
    this.UserId = UserId;
    this.LocationId = LocationId;
    this.EntryTime = EntryTime ? BaseEntity._toDate(EntryTime) : null;
    this.Selfie = Selfie instanceof Buffer || Selfie === null ? Selfie : null;
    this.UpdatedAt = UpdatedAt ? BaseEntity._toDate(UpdatedAt) : null;
    this.IsSynced = !!IsSynced;
    this.DeviceId = DeviceId ?? null;
    this.IsDeleted = !!IsDeleted;
  }

  static readonly tableName = 'Entries';

  static readonly columns = [
    'Id',
    'UserId',
    'LocationId',
    'EntryTime',
    'Selfie',
    'UpdatedAt',
    'IsSynced',
    'DeviceId',
    'IsDeleted',
  ];

  static fromRow(row: Partial<EntryProps> = {}): Entry {
    return new Entry({
      Id: row.Id ?? null,
      UserId: row.UserId ?? 0,
      LocationId: row.LocationId ?? 0,
      EntryTime: row.EntryTime ?? null,
      Selfie: row.Selfie ?? null,
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
      EntryTime: (this.constructor as typeof BaseEntity)._toISO(this.EntryTime),
      Selfie: this.Selfie,
      UpdatedAt: (this.constructor as typeof BaseEntity)._toISO(this.UpdatedAt),
      IsSynced: this.IsSynced ? 1 : 0,
      DeviceId: this.DeviceId,
      IsDeleted: this.IsDeleted ? 1 : 0,
    };
  }
}