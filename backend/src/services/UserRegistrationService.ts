// src/services/UserRegistrationService.js
const { findUserByEmail, createUser } = require('../repositories/UserRepository');
const { hashPassword } = require('../common/utils/HashPassword');
const { validateUserRegistrationData, validateRole } = require('../common/utils/validators/userValidator');
const AppError = require('../common/utils/errors/AppError');
const ErrorMessages = require('../common/utils/errors/ErrorMessage');
const { USER_ROLES, HTTP_STATUS } = require('../common/config/constants');

const checkEmailAvailability = async (email:string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError(
      ErrorMessages.USER.EMAIL_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }
};

const prepareUserData = async (userData:any) => {
  const hashedPassword = await hashPassword(userData.password);
  const role = userData.role || USER_ROLES.CUSTOMER;
  
  return {
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    phone: userData.phone.trim(),
    password: hashedPassword,
    role: role
  };
};

const sanitizeUserResponse = (user:any) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const registerUser = async (userData:any) => {
  // Validate input data
  validateUserRegistrationData(userData);
  
  // Validate role if provided
  if (userData.role) {
    validateRole(userData.role, Object.values(USER_ROLES));
  }
  
  // Check if email is already registered
  await checkEmailAvailability(userData.email);
  
  // Prepare user data with hashed password
  const preparedUserData = await prepareUserData(userData);
  
  // Create user in database
  const newUser = await createUser(preparedUserData);
  
  // Return sanitized user data
  return sanitizeUserResponse(newUser);
};

module.exports = {
  registerUser,
  sanitizeUserResponse
};
