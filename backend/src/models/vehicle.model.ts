import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
      required: [true, "brand name is required"],
    },
    model: {
      type: String,
      trim: true,
      required: [true, "model is required"],
    },
    make: {
      type: String,
      required: [true, "manufacturing year is required"],
    },
    category: {
      type: String,
      enum: ["SUV", "sedan", "coupe", "hatchback", "electric", "muv"],
      required: [true, "car type is required"],
    },
    price: {
      type: Number,
      required: [true, "vehicle price is required"],
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
