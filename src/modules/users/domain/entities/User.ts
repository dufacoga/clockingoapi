import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface UserProps {
  Id?: number | null;
  Name: string;
  Phone?: string | null;
  Username: string;
  AuthToken: string;
  RoleId: number;
  IsDeleted?: boolean | number;
  TotpSecret?: string | null;
  TwoFactorEnabled?: boolean | number;
  RecoveryCodes?: string | null;
}

export class User extends BaseEntity {
  Id: number | null;
  Name: string;
  Phone: string | null;
  Username: string;
  AuthToken: string;
  RoleId: number;
  IsDeleted: boolean;
  TotpSecret: string | null;
  TwoFactorEnabled: boolean;
  RecoveryCodes: string | null;

  constructor({
    Id = null,
    Name,
    Phone = null,
    Username,
    AuthToken,
    RoleId,
    IsDeleted = false,
    TotpSecret = null,
    TwoFactorEnabled = false,
    RecoveryCodes = null,
  }: UserProps) {
    super();
    this.Id = Id;
    this.Name = Name;
    this.Phone = Phone;
    this.Username = Username;
    this.AuthToken = AuthToken;
    this.RoleId = RoleId;
    this.IsDeleted = !!IsDeleted;
    this.TotpSecret = TotpSecret;
    this.TwoFactorEnabled = !!TwoFactorEnabled;
    this.RecoveryCodes = RecoveryCodes;
  }

  static override get tableName(): string {
    return 'Users';
  }

  static override get columns(): string[] {
    return [
      'Id',
      'Name',
      'Phone',
      'Username',
      'AuthToken',
      'RoleId',
      'IsDeleted',
      'TwoFactorEnabled',
      'TotpSecret',
      'RecoveryCodes',
    ];
  }

  static fromRow(row: Partial<UserProps> = {}): User {
    return new User({
      Id: row.Id ?? null,
      Name: row.Name ?? '',
      Phone: row.Phone ?? null,
      Username: row.Username ?? '',
      AuthToken: row.AuthToken ?? '',
      RoleId: row.RoleId ?? 0,
      IsDeleted: row.IsDeleted ?? false,
      TotpSecret: row.TotpSecret ?? null,
      TwoFactorEnabled: row.TwoFactorEnabled ?? false,
      RecoveryCodes: row.RecoveryCodes ?? null,
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
      TwoFactorEnabled: this.TwoFactorEnabled ? 1 : 0,
      TotpSecret: this.TotpSecret,
      RecoveryCodes: this.RecoveryCodes,
    };
  }
}