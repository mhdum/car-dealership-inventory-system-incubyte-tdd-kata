const { z } = require('zod');

// 1. Define the runtime Zod Validation Schema using CommonJS syntax
const loginSchema = z.object({
  email: z.string().email('Invalid email address layout').lowercase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// 2. TypeScript compile-time type inference
export type LoginCredentials = typeof loginSchema._input;

export interface SanitizedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface LoginResult {
  token: string;
  user: SanitizedUser;
}

// 3. Export using CommonJS syntax
module.exports = {
  loginSchema
};