const Vehicle = require('../models/vehicle.model'); 

/**
 * Creates and persists a new vehicle record in MongoDB
 * @param {Object} vehicleData 
 * @returns {Promise<Object>} Lean plain JS object of the saved vehicle document
 */
async function createVehicleRecord(vehicleData:any) {
  const vehicle = new Vehicle(vehicleData);
  const savedVehicle = await vehicle.save();
  return savedVehicle.toObject(); // Converts Mongoose Document to plain object for clean service handling
}

/**
 * Finds a vehicle by its MongoDB ObjectId
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
async function findVehicleById(id:any) {
  return await Vehicle.findById(id).lean();
}

/**
 * Fetches all vehicles with optional query filters
 * @param {Object} filter 
 * @returns {Promise<Array>}
 */
async function findAllVehicles(filter = {}) {
  return await Vehicle.find(filter).lean();
}

/**
 * Updates an existing vehicle record by ID
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<Object|null>} Updated vehicle document
 */
async function updateVehicleRecord(id:any, updateData:any) {
  return await Vehicle.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  ).lean();
}

/**
 * Deletes a vehicle record by ID
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
async function deleteVehicleRecord(id:any) {
  return await Vehicle.findByIdAndDelete(id).lean();
}

module.exports = {
  createVehicleRecord,
  findVehicleById,
  findAllVehicles,
  updateVehicleRecord,
  deleteVehicleRecord
};