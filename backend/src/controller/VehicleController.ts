import { type Response,type NextFunction } from 'express';
import {type AuthenticatedRequest } from '../middlewares/auth.middleware';
const { createVehicle } = require('../services/VehicleService');

async function createVehicleController(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const vehicle = await createVehicle(req.body);

    res.status(201).json({
      status: 'success',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {createVehicleController}