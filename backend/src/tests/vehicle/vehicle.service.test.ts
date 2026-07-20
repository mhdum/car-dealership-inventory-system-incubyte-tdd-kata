const { createVehicle } = require('../../../src/services/VehicleService');
const { createVehicleRecord } = require('../../../src/repositories/VehicleRepository');

jest.mock('../../../src/repositories/VehicleRepository');

describe('VehicleService - createVehicle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validVehiclePayload = {
    brand: 'Toyota',
    model: 'Camry',
    make: '2024',
    category: 'sedan',
    price: 28000,
    quantity: 5,
    images: ['https://example.com/car.jpg'],
    status: 'available'
  };

  it('should create a vehicle record successfully', async () => {
    const createdRecord = {
      _id: '607f1f77bcf86cd799439099',
      ...validVehiclePayload,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    createVehicleRecord.mockResolvedValue(createdRecord);

    const result = await createVehicle(validVehiclePayload);

    expect(result).toHaveProperty('_id');
    expect(result.brand).toBe(validVehiclePayload.brand);
    expect(result.model).toBe(validVehiclePayload.model);
    expect(createVehicleRecord).toHaveBeenCalledWith(validVehiclePayload);
    expect(createVehicleRecord).toHaveBeenCalledTimes(1);
  });

  it('should propagate database repository errors safely', async () => {
    const dbError = new Error('Database connection failed');
    createVehicleRecord.mockRejectedValue(dbError);

    await expect(createVehicle(validVehiclePayload))
      .rejects
      .toThrow('Database connection failed');

    expect(createVehicleRecord).toHaveBeenCalledWith(validVehiclePayload);
  });
});