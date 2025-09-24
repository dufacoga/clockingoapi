function toBool(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true';
  return Boolean(v);
}

function fromBool(b) {
  return b ? 1 : 0;
}

function toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  return new Date(v);
}

function toISOorNull(v) {
  const d = toDate(v);
  return d ? d.toISOString().slice(0, 19).replace('T', ' ') : null;
}

class BaseEntity {
  static get tableName() { throw new Error('Implement tableName'); }
  static get columns() { throw new Error('Implement columns'); }
  
  validate() {}
  
  static _toBool = toBool;
  static _fromBool = fromBool;
  static _toISO = toISOorNull;
  static _toDate = toDate;
}

module.exports = { BaseEntity, toBool, fromBool, toDate, toISOorNull };
