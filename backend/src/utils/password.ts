import bcrypt from 'bcryptjs';

// Mongoose hid this behind a pre('save') hook on the User model; Drizzle
// has no equivalent lifecycle hook, so hashing/comparing is now explicit
// at the two call sites that need it (register, login) instead of magic.
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, 12);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
