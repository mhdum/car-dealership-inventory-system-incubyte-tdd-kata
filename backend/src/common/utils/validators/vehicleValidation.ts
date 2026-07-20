const { z } = require("zod");
import type { z as ZodType } from "zod";

const vehicleSchema = z.object({
  brand: z.string().trim().min(1, "brand name is required"),
  model: z.string().trim().min(1, "model is required"),
  make: z.string().trim().min(1, "manufacturing year is required"),
  category: z.enum(["SUV", "sedan", "coupe", "hatchback", "electric", "muv"], {
    errorMap: () => ({ message: "car type is required" }),
  }),
  price: z
    .number({ invalid_type_error: "vehicle price is required" })
    .positive("vehicle price must be greater than 0"),
  quantity: z.number().int().min(0).optional().default(0),
  images: z.array(z.string()).optional(),
  status: z.enum(["available", "sold"]).optional().default("available"),
});

export type VehicleInput = ZodType.infer<typeof vehicleSchema>;

const validateVehicle = (data: unknown) => vehicleSchema.parse(data);

module.exports = { vehicleSchema, validateVehicle };
