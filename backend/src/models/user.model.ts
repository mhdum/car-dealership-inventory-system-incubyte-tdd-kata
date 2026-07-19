// src/models/User.js
const mongoose = require('mongoose');
const { USER_ROLES, USER_STATUS, VALIDATION } = require('../common/config/constants');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: VALIDATION.NAME_MIN_LENGTH,
      maxlength: VALIDATION.NAME_MAX_LENGTH,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      minlength: VALIDATION.EMAIL_MIN_LENGTH,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "email is required"],
    },
    phone: {
      type: String,
      minlength: VALIDATION.PHONE_MIN_LENGTH,
      maxlength: VALIDATION.PHONE_MAX_LENGTH,
      required: [true, "phone number is required"],
    },
    password: {
      type: String,
      minlength: VALIDATION.PASSWORD_MIN_LENGTH,
      maxlength: VALIDATION.PASSWORD_MAX_LENGTH,
      select: false,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
      required: [true, "role is required"],
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc:any, ret:any) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

const User = mongoose.model("User", UserSchema);

module.exports = User;
