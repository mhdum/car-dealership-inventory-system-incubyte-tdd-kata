const bcrypt = require('bcrypt');
const { BCRYPT } = require('../config/constants');
const ErrorMessages = require('../utils/errors/ErrorMessage');

const hashPassword = async (plainPassword:string) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, BCRYPT.SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error(ErrorMessages.SERVER.HASHING_ERROR);
  }
};

const verifyPassword = async (plainPassword:string, hashedPassword:string) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(ErrorMessages.SERVER.HASHING_ERROR);
  }
};

module.exports = {
  hashPassword,
  verifyPassword
};
