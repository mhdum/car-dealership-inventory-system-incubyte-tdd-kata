const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../app');
const Vehicle = require('../../models/vehicle.model');
const jwt = require('jsonwebtoken');

const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/car_inventory_test';
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const generateMockToken = (userId: string, role = 'admin') => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

describe('POST /api/vehicles (TDD)', () => {
  const validVehicleData = {
    brand: ' Toyota ',
    model: 'RAV4',
    make: '2025',
    category: 'SUV',
    price: 32000,
    quantity: 3,
    images: ['https://example.com/rav4.jpg'],
  };

  // 1. Connect to MongoDB BEFORE any hooks run
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
  });

  // 2. Clear collection before each test
  beforeEach(async () => {
    await Vehicle.deleteMany({});
  });

  // 3. Properly close and cleanup connections
  afterAll(async () => {
    await Vehicle.deleteMany({});
    await mongoose.connection.close();
  });

  // --- TESTS ---
  it('should return 401 if Authorization header is missing', async () => {
    const res = await request(app).post('/api/vehicles').send(validVehicleData);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Token required');
  });

  it('should return 401 if Token is invalid', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', 'Bearer invalid_token_string')
      .send(validVehicleData);

    expect(res.status).toBe(401);
  });

  it('should create a vehicle successfully when valid token and data are passed', async () => {
    const token = `Bearer ${generateMockToken('user123')}`;

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', token)
      .send(validVehicleData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brand).toBe('Toyota');
    expect(res.body.data.status).toBe('available');
    expect(res.body.data).toHaveProperty('_id');
  });

  it('should return 400 if required fields are missing', async () => {
    const token = `Bearer ${generateMockToken('user123')}`;
    const missingBrandData = { ...validVehicleData, brand: undefined };

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', token)
      .send(missingBrandData);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('brand name is required');
  });
});