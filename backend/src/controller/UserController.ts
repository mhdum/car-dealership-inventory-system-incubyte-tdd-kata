import { type Request, type Response } from 'express';
// src/controllers/UserController.js
const { registerUser } = require('../services/UserRegistrationService');
const AppError = require('../common/utils/errors/AppError');
const { HTTP_STATUS } = require('../common/config/constants');

const handleError = (error:any, res:Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      timestamp: error.timestamp
    });
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error);
  
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
};

const register = async (req:Request, res:Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const user = await registerUser({
      name,
      email,
      phone,
      password,
      role
    });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: user,
      message: 'User registered successfully'
    });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports = {
  register
};
