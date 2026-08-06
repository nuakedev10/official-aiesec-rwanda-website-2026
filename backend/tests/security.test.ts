describe('JWT_SECRET enforcement', () => {
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
    jest.resetModules();
  });

  it('throws at import time if JWT_SECRET is not set', () => {
    jest.resetModules();
    delete process.env.JWT_SECRET;
    expect(() => require('../src/utils/jwt')).toThrow(/JWT_SECRET is not set/);
  });

  it('does not throw when JWT_SECRET is set', () => {
    jest.resetModules();
    process.env.JWT_SECRET = 'a-real-secret';
    expect(() => require('../src/utils/jwt')).not.toThrow();
  });
});

describe('CORS production safeguard', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalClientUrl = process.env.CLIENT_URL;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    process.env.CLIENT_URL = originalClientUrl;
    jest.resetModules();
  });

  it('refuses to boot in production with no CLIENT_URL set', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    delete process.env.CLIENT_URL;
    const { createApp } = require('../src/app');
    expect(() => createApp()).toThrow(/CLIENT_URL must be set/);
  });

  it('boots fine in production when CLIENT_URL is set', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    process.env.CLIENT_URL = 'https://aiesec.rw';
    const { createApp } = require('../src/app');
    expect(() => createApp()).not.toThrow();
  });
});
