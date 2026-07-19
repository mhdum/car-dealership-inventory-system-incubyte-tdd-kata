// src/middlewares/errorHandler.js
const AppError = require('../common/utils/errors/AppError');
const { HTTP_STATUS } = require('../common/config/constants');
import { type Request, type Response } from 'express';

const errorHandler = (err:any, req:Request, res:Response, next:any) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, HTTP_STATUS.NOT_FOUND);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, HTTP_STATUS.CONFLICT);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val:any)=> val.message).join(', ');
    error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || 'Server Error',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
