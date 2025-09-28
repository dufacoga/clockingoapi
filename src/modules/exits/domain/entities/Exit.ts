import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface ExitProps {
  Id?: number | null;
  UserId: number;
  LocationId: number;
  ExitTime?: Date | string | null;
  EntryId: number;
  Result?: string | null;
  IrregularBehavior?: boolean | number;
  ReviewedByAdmin?: boolean | number;
  UpdatedAt?: Date | string | null;
  IsSynced?: boolean | number;
  DeviceId?: string | null;
  IsDeleted?: boolean | number;
}

export class Exit extends BaseEntity {
  Id: number | null;
  UserId: number;
  LocationId: number;
  ExitTime: Date | null;
  EntryId: number;
  Result: string | null;
  IrregularBehavior: boolean;
  ReviewedByAdmin: boolean;
  UpdatedAt: Date | null;
  IsSynced: boolean;
  DeviceId: string | null;
  IsDeleted: boolean;

  constructor({
    Id = null,
    UserId,
    LocationId,
    ExitTime = null,
    EntryId,
    Result = null,
    IrregularBehavior = false,
    ReviewedByAdmin = false,
    UpdatedAt = null,
    IsSynced = false,
    DeviceId = null,
    IsDeleted = false,
  }: ExitProps) {
    super();
    this.Id = Id;
    this.UserId = UserId;
    this.LocationId = LocationId;
    this.ExitTime = ExitTime ? BaseEntity._toDate(ExitTime) : null;
    this.EntryId = EntryId;
    this.Result = Result ?? null;
    this.IrregularBehavior = !!IrregularBehavior;
    this.ReviewedByAdmin = !!ReviewedByAdmin;
    this.UpdatedAt = UpdatedAt ? BaseEntity._toDate(UpdatedAt) : null;
    this.IsSynced = !!IsSynced;
    this.DeviceId = DeviceId ?? null;
    this.IsDeleted = !!IsDeleted;
  }

  static get tableName() {
    return 'Exits';
  }

  static get columns() {
    return [
      'Id',
      'UserId',
      'LocationId',
      'ExitTime',
      'EntryId',
      'Result',
      'IrregularBehavior',
      'ReviewedByAdmin',
      'UpdatedAt',
      'IsSynced',
      'DeviceId',
      'IsDeleted',
    ];
  }

  static fromRow(row: Partial<ExitProps> = {}): Exit {
    return new Exit({
      Id: row.Id ?? null,
      UserId: row.UserId ?? 0,
      LocationId: row.LocationId ?? 0,
      ExitTime: row.ExitTime ?? null,
      EntryId: row.EntryId ?? 0,
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
      ExitTime: (this.constructor as typeof BaseEntity)._toISO(this.ExitTime),
      EntryId: this.EntryId,
      Result: this.Result,
      IrregularBehavior: this.IrregularBehavior ? 1 : 0,
      ReviewedByAdmin: this.ReviewedByAdmin ? 1 : 0,
      UpdatedAt: (this.constructor as typeof BaseEntity)._toISO(this.UpdatedAt),
      IsSynced: this.IsSynced ? 1 : 0,
      DeviceId: this.DeviceId,
      IsDeleted: this.IsDeleted ? 1 : 0,
    };
  }
}