import mongoose from "mongoose";
const PurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userid is required"],
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "vehicle id is required"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "net banking"],
      required: [true, "payment method is required"],
    },
    deliveryAddress: {
      building: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

const Purchase= mongoose.model("Purchase",PurchaseSchema)

export default Purchase