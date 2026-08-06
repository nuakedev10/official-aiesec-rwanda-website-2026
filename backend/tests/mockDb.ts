// Drizzle queries are chains (db.select().from().where().orderBy()...)
// rather than Mongoose's flat static methods (Model.find()), so mocking
// them needs a different shape: an object where every chain method
// returns itself, and the chain resolves to a controlled value when
// awaited (Drizzle query builders are thenable).
export function chain(resolveValue: any) {
  const c: any = {
    then: (resolve: (v: any) => any, reject?: (e: any) => any) =>
      Promise.resolve(resolveValue).then(resolve, reject),
    catch: (reject: (e: any) => any) => Promise.resolve(resolveValue).catch(reject),
  };
  const methods = [
    'select',
    'from',
    'where',
    'orderBy',
    'limit',
    'offset',
    'values',
    'set',
    'returning',
    '$dynamic',
  ];
  methods.forEach((m) => {
    c[m] = jest.fn(() => c);
  });
  return c;
}

export function mockDb() {
  return {
    select: jest.fn(() => chain([])),
    insert: jest.fn(() => chain([])),
    update: jest.fn(() => chain([])),
    delete: jest.fn(() => chain([])),
    execute: jest.fn(() => Promise.resolve()),
  };
}
