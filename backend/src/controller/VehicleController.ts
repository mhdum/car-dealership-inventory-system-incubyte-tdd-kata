import {type Request,type Response} from 'express'
const Vehicle = require('../models/vehicle.model');
const catchAsync = require('../common/utils/catchAsync');

const createVehicle = catchAsync(async (req:Request, res:Response) => {
  const newVehicle = new Vehicle(req.body);
  const savedVehicle = await newVehicle.save();
  
  res.status(201).json({
    success: true,
    data: savedVehicle
  });
});



module.exports = { 
  createVehicle
};