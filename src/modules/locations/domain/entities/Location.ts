import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface LocationProps {
  Id?: number | null;
  Code: string;
  Address?: string | null;
  City?: string | null;
  CreatedBy: number;
  IsCompanyOffice?: boolean | number;
  IsDeleted?: boolean | number;
}

export class Location extends BaseEntity {
  Id: number | null;
  Code: string;
  Address: string | null;
  City: string | null;
  CreatedBy: number;
  IsCompanyOffice: boolean;
  IsDeleted: boolean;

  constructor({
    Id = null,
    Code,
    Address = null,
    City = null,
    CreatedBy,
    IsCompanyOffice = false,
    IsDeleted = false,
  }: LocationProps) {
    super();
    this.Id = Id;
    this.Code = Code;
    this.Address = Address;
    this.City = City;
    this.CreatedBy = CreatedBy;
    this.IsCompanyOffice = !!IsCompanyOffice;
    this.IsDeleted = !!IsDeleted;
  }

  static readonly tableName = 'Locations';

  static readonly columns = [
    'Id',
    'Code',
    'Address',
    'City',
    'CreatedBy',
    'IsCompanyOffice',
    'IsDeleted',
  ];

  static fromRow(row: Partial<LocationProps> = {}): Location {
    return new Location({
      Id: row.Id ?? null,
      Code: row.Code ?? '',
      Address: row.Address ?? null,
      City: row.City ?? null,
      CreatedBy: row.CreatedBy ?? 0,
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