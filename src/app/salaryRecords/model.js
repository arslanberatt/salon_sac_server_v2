const mongoose = require("mongoose");

const SalaryRecordSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["maas", "prim", "avans"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "salaryRecord" }
);

module.exports = mongoose.model("SalaryRecord", SalaryRecordSchema);
