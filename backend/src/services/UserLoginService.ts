const { findUserByEmail } = require('../repositories/UserRepository');
const { verifyPassword } = require('../common/utils/HashPassword');
const { generateToken } = require('../common/utils/JwtToken');
const {loginSchema,LoginCredentials} = require('../common/utils/validators/auth.schema')

// Define explicit interfaces for what the service layer promises to return
export interface SanitizedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  token: string;
  user: SanitizedUser;
}

/**
 * Validates user credentials, authenticates, and issues a session token.
 * Throws ZodError if payload structure is invalid.
 */
 async function loginUser(credentials: typeof LoginCredentials): Promise<LoginResult> {
  // 1. Enforce strict schema constraints immediately at the runtime boundary
  const parsedData = loginSchema.parse(credentials);
  
  // 2. Fetch user via repository using normalized, safely parsed email
  const user = await findUserByEmail(parsedData.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 3. Verify plain text password against database security hashes
  const isPasswordValid = await verifyPassword(parsedData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // 4. Generate the JWT authorization token payload
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  // 5. Destructure to cleanly decouple data layout layers and exclude password hash
  const { password, ...sanitizedUser } = user;

  return {
    token,
    user: sanitizedUser as SanitizedUser,
  };
}   

module.exports ={loginUser}