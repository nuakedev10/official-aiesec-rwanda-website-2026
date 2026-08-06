import jwt from 'jsonwebtoken';

// No fallback secret on purpose. A hardcoded default like
// 'dev-secret-change-me' is the kind of thing that quietly ships to
// production when someone forgets to set an env var — and once it's in a
// public repo or a shared chat log (like this one), anyone can forge a
// valid SUPER_ADMIN token against any deployment that's still using it.
// Failing loudly at boot is safer than failing silently at runtime.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // tests/setup.ts sets a JWT_SECRET before any test file imports this
  // module, so this only ever fires for a real misconfiguration.
  throw new Error('JWT_SECRET is not set. Generate one and add it to your .env file.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  id: string;
  role: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
