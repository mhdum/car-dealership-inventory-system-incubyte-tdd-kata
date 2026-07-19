// src/utils/validators/userValidator.js
const { VALIDATION } = require('../../config/constants');
const ErrorMessages = require('../../utils/errors/ErrorMessage');

const validateEmail = (email:string) => {
  if (!email) {
    throw new Error(ErrorMessages.VALIDATION.EMAIL_REQUIRED);
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(ErrorMessages.VALIDATION.EMAIL_INVALID);
  }
  
  return true;
};

const validatePassword = (password:string) => {
  if (!password) {
    throw new Error(ErrorMessages.VALIDATION.PASSWORD_REQUIRED);
  }
  
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    throw new Error(ErrorMessages.VALIDATION.PASSWORD_TOO_SHORT);
  }
  
  return true;
};

const validateName = (name:string) => {
  if (!name || !name.trim()) {
    throw new Error(ErrorMessages.VALIDATION.NAME_REQUIRED);
  }
  
  return true;
};

const validatePhone = (phone:string) => {
  if (!phone) {
    throw new Error(ErrorMessages.VALIDATION.PHONE_REQUIRED);
  }
  
  const phoneRegex = /^\+?[\d\s-]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error(ErrorMessages.VALIDATION.PHONE_INVALID);
  }
  
  return true;
};

const validateRole = (role:string, allowedRoles:[string]) => {
  if (role && !allowedRoles.includes(role)) {
    throw new Error(ErrorMessages.VALIDATION.ROLE_INVALID);
  }
  
  return true;
};

const validateUserRegistrationData = (userData:any) => {
  validateName(userData.name);
  validateEmail(userData.email);
  validatePhone(userData.phone);
  validatePassword(userData.password);
  
  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRole,
  validateUserRegistrationData
};
