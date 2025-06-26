const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    start_time: {
      type: String,
      required: true,
    },
    is_done: {
      type: Boolean,
      default: false,
    },
    is_cancelled: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    collection: "appointments",
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
