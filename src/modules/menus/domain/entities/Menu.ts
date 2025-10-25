import { BaseEntity } from '../../../../shared/domain/BaseEntity';

export interface MenuProps {
  Id?: number | null;
  NameEs: string;
  NameEn: string;
  ParentId?: number | null;
  Level?: number;
  DisplayOrder?: number;
  IsDeleted?: boolean | number;
}

export class Menu extends BaseEntity {
  Id: number | null;
  NameEs: string;
  NameEn: string;
  ParentId: number | null;
  Level: number;
  DisplayOrder: number;
  IsDeleted: boolean;

  constructor({
    Id = null,
    NameEs,
    NameEn,
    ParentId = null,
    Level = 1,
    DisplayOrder = 0,
    IsDeleted = false,
  }: MenuProps) {
    super();
    this.Id = Id;
    this.NameEs = NameEs;
    this.NameEn = NameEn;
    this.ParentId = ParentId;
    this.Level = Level ?? 1;
    this.DisplayOrder = DisplayOrder ?? 0;
    this.IsDeleted = !!IsDeleted;
  }

  static override get tableName(): string {
    return 'Menus';
  }

  static override get columns(): string[] {
    return ['Id', 'NameEs', 'NameEn', 'ParentId', 'Level', 'DisplayOrder', 'IsDeleted'];
  }

  static fromRow(row: Partial<MenuProps> = {}): Menu {
    return new Menu({
      Id: row.Id ?? null,
      NameEs: row.NameEs ?? '',
      NameEn: row.NameEn ?? '',
      ParentId: row.ParentId ?? null,
      Level: row.Level ?? 1,
      DisplayOrder: row.DisplayOrder ?? 0,
      IsDeleted: row.IsDeleted ?? false,
    });
  }

  toRow() {
    return {
      Id: this.Id ?? undefined,
      NameEs: this.NameEs,
      NameEn: this.NameEn,
      ParentId: this.ParentId ?? null,
      Level: this.Level,
      DisplayOrder: this.DisplayOrder,
      IsDeleted: this.IsDeleted ? 1 : 0,
    };
  }
}
