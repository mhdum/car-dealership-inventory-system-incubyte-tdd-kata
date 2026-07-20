const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/common/utils/JwtToken');
const { createVehicleRecord } = require('../../../src/repositories/VehicleRepository');

jest.mock('../../../src/repositories/VehicleRepository');

describe('POST /api/vehicles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    brand: 'Tesla',
    model: 'Model 3',
    make: '2023',
    category: 'electric',
    price: 35000,
    quantity: 2,
    images: ['https://example.com/model3.jpg']
  };

  const validAuthToken = generateToken({ id: 'user_123', role: 'admin' });

  it('should return 401 Unauthorized if Authorization header is missing', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .send(validPayload);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Authentication token missing or invalid');
  });

  it('should return 401 Unauthorized if token is invalid or expired', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', 'Bearer invalid_token_xyz')
      .send(validPayload);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Authentication token missing or invalid');
  });

  it('should return 201 Created when authenticated and payload is valid', async () => {
    createVehicleRecord.mockResolvedValue({
      _id: '607f1f77bcf86cd799439099',
      ...validPayload,
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${validAuthToken}`)
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.brand).toBe(validPayload.brand);
  });

  it('should return 400 Bad Request if invalid category is passed', async () => {
    const invalidPayload = {
      ...validPayload,
      category: 'convertible' // Not in enum ["SUV", "sedan", "coupe", "hatchback", "electric", "muv"]
    };

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${validAuthToken}`)
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('fail');
    expect(response.body.errors[0].field).toBe('category');
  });
});