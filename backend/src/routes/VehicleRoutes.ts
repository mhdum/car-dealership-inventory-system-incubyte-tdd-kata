const { Router } = require('express');
const { createVehicleController } = require('../controller/VehicleController');
const { authenticate } = require('../middlewares/auth.middleware');
const  validateBody  = require('../middlewares/validateRequest');
const { createVehicleSchema } = require('../common/utils/validators/vehicle.schema');

const vehicleRouter = Router();

// Endpoint: POST /api/vehicles
// Sequence: 1. Verify JWT -> 2. Validate Zod Schema -> 3. Execute Controller
vehicleRouter.post(
  '/', 
  authenticate, 
  validateBody(createVehicleSchema), 
  createVehicleController
);

module.exports = vehicleRouter;