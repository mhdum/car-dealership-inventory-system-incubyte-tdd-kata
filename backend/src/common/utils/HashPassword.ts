// src/utils/PasswordHasher.js
const bcrypt = require('bcrypt');

const hashPassword = async (password:string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password:string, hashedPassword:string) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
