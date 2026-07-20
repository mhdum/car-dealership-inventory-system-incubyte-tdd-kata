const { createVehicleRecord } = require('../repositories/VehicleRepository');

/**
 * Service to handle creation of new vehicle inventory entries
 * @param {Object} vehicleData 
 * @returns {Promise<Object>} Created vehicle document
 */
async function createVehicle(vehicleData:any) {
  const createdVehicle = await createVehicleRecord(vehicleData);
  return createdVehicle;
}

module.exports = { createVehicle };