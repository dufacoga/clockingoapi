import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface RoleProps {
  Id?: number | null;
  Name: string;
}

export class Role extends BaseEntity {
  Id: number | null;
  Name: string;

  constructor({ Id = null, Name }: RoleProps) {
    super();
    this.Id = Id;
    this.Name = Name;
  }

  static get tableName() {
    return 'Roles';
  }

  static get columns() {
    return ['Id', 'Name'];
  }

  static fromRow(row: Partial<RoleProps> = {}): Role {
    return new Role({
      Id: row.Id ?? null,
      Name: row.Name ?? '',
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      Name: this.Name,
    };
  }
}