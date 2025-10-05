import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface UserProps {
  Id?: number | null;
  Name: string;
  Phone?: string | null;
  Username: string;
  AuthToken: string;
  RoleId: number;
  IsDeleted?: boolean | number;
}

export class User extends BaseEntity {
  Id: number | null;
  Name: string;
  Phone: string | null;
  Username: string;
  AuthToken: string;
  RoleId: number;
  IsDeleted: boolean;

  constructor({ Id = null, Name, Phone = null, Username, AuthToken, RoleId, IsDeleted = false }: UserProps) {
    super();
    this.Id = Id;
    this.Name = Name;
    this.Phone = Phone;
    this.Username = Username;
    this.AuthToken = AuthToken;
    this.RoleId = RoleId;
    this.IsDeleted = !!IsDeleted;
  }

  static readonly tableName = 'Users';

  static readonly columns = [
    'Id',
    'Name',
    'Phone',
    'Username',
    'AuthToken',
    'RoleId',
    'IsDeleted',
  ];

  static fromRow(row: Partial<UserProps> = {}): User {
    return new User({
      Id: row.Id ?? null,
      Name: row.Name ?? '',
      Phone: row.Phone ?? null,
      Username: row.Username ?? '',
      AuthToken: row.AuthToken ?? '',
      RoleId: row.RoleId ?? 0,
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