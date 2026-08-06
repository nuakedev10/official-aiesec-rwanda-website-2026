// Global test setup. We deliberately do NOT connect to a real MongoDB here —
// tests mock the Mongoose model methods directly so the whole suite runs
// fully offline and fast. This tests real Express routing, middleware,
// validation, and controller logic; it does not test actual MongoDB
// query correctness. See README "Testing" section for why, and for how
// to run the fuller integration suite against a real database.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
