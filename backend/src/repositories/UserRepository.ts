// src/repositories/UserRepository.js
const User = require('../models/user.model');
const AppError = require('../common/utils/errors/AppError');
const ErrorMessages = require('../common/utils/errors/ErrorMessage');
const { HTTP_STATUS } = require('../common/config/constants');

const findUserByEmail = async (email:string) => {
  try {
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    throw new AppError(
      ErrorMessages.SERVER.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const createUser = async (userData:any) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser;
  } catch (error:any) {
    if (error.code === 11000) {
      throw new AppError(
        ErrorMessages.USER.EMAIL_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }
    throw new AppError(
      ErrorMessages.SERVER.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const findUserById = async (userId:any) => {
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      throw new AppError(
        ErrorMessages.USER.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ErrorMessages.SERVER.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById
};
