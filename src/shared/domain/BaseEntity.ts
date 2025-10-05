export function toBool(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true';
  return Boolean(v);
}

export function fromBool(b: boolean): number {
  return b ? 1 : 0;
}

export function toDate(v: unknown): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  return new Date(v as string | number);
}

export function toISOorNull(v: unknown): string | null {
  const d = toDate(v);
  return d ? d.toISOString().slice(0, 19).replace('T', ' ') : null;
}

export abstract class BaseEntity {
  static get tableName(): string {
    throw new Error('Implement tableName');
  }
  static get columns(): string[] {
    throw new Error('Implement columns');
  }

  validate(): void {
    throw new Error('Validate method not implemented');
  }
  
  static _toBool = toBool;
  static _fromBool = fromBool;
  static _toISO = toISOorNull;
  static _toDate = toDate;
}