import { type Request, type Response } from 'express';
const { HTTP_STATUS } = require('../common/config/constants');

const validateRequest = (schema:any) => {
  return (req:Request, res:Response, next:any) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail:any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        errors,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  };
};

module.exports = validateRequest;
