const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_mod: {
      type: Boolean,
      default: false,
    },
    salary: {
      type: Number,
      default: 0,
    },
    commissionRate: {
      type: Number,
      default: 0,
    },
    reset: {
      code: {
        type: String,
        default: null,
      },
      time: {
        type: Date,
        default: null,
      },
    },
    avatar: {
      type: String,
      // default: "https://example.com/default-avatar.png", // Default avatar URL
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
