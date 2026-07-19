const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      minlength: 2,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "email is required"],
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 15,
      required: [true, "phone number is required"],
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 50,
      select: false,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      required: [true, "role is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
