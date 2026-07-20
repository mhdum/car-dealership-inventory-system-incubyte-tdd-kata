const { z } = require('zod');

const createVehicleSchema = z.object({
  brand: z.string({ required_error: 'brand name is required' }).trim().min(1, 'brand name is required'),
  model: z.string({ required_error: 'model is required' }).trim().min(1, 'model is required'),
  make: z.string({ required_error: 'manufacturing year is required' }).min(1, 'manufacturing year is required'),
  category: z.enum(['SUV', 'sedan', 'coupe', 'hatchback', 'electric', 'muv'], {
    errorMap: () => ({ message: 'Invalid category. Must be one of: SUV, sedan, coupe, hatchback, electric, muv' })
  }),
  price: z.number({ required_error: 'vehicle price is required' }).positive('price must be a positive number'),
  quantity: z.number().int().min(0, 'quantity cannot be negative').default(0),
  images: z.array(z.string().url('image must be a valid URL')).optional().default([]),
  status: z.enum(['available', 'sold']).default('available')
});

module.exports = {
  createVehicleSchema
};