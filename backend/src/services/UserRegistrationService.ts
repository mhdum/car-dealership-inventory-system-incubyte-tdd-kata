// src/services/UserRegistrationService.js
const { findUserByEmail, createUser } = require('../repositories/UserRepository');
const { hashPassword } = require('../common/utils/HashPassword');

const registerUser = async (userData:any) => {
  // Check if email already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash the password
  const hashedPassword = await hashPassword(userData.password);

  // Assign default role if not provided
  const role = userData.role || 'customer';

  // Create user with hashed password
  const newUser = await createUser({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: hashedPassword,
    role: role
  });

  return newUser;
};

module.exports = {
  registerUser
};
