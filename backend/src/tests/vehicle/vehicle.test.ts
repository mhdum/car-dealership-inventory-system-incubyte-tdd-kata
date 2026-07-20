const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../src/app');
const Vehicle = require('../../src/models/Vehicle');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const generateMockToken = (userId:string, role = 'admin') => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

describe('POST /api/vehicles (TDD - CommonJS)', () => {
  const validVehicleData = {
    brand: ' Toyota ', // with spaces to test trimming
    model: 'RAV4',
    make: '2025',
    category: 'SUV',
    price: 32000,
    quantity: 3,
    images: ['https://example.com/rav4.jpg']
  };

  beforeEach(async () => {
    await Vehicle.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // --- PHASE 1: TESTING AUTHENTICATION ---
  it('should return 401 if Authorization header is missing', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send(validVehicleData);

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

  // --- PHASE 2: TESTING SUCCESS PATH ---
  it('should create a vehicle successfully when valid token and data are passed', async () => {
    const token = `Bearer ${generateMockToken('user123')}`;

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', token)
      .send(validVehicleData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brand).toBe('Toyota'); // Checks Mongoose trim functionality
    expect(res.body.data.status).toBe('available');
    expect(res.body.data).toHaveProperty('_id');
  });

  // --- PHASE 3: TESTING SCHEMA VALIDATION ---
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