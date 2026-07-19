// src/repositories/UserRepository.js
const User = require('../models/user.model');

const findUserByEmail = async (email:string) => {
  return await User.findOne({ email }).exec();
};

const createUser = async (userData:any) => {
  const user = new User(userData);
  return await user.save();
};

const findUserById = async (id:any) => {
  return await User.findById(id).exec();
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById
};
