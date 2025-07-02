const { duration } = require("moment");
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "services",
    timestamps: false,
  }
);

const service = mongoose.model("Service", serviceSchema);
module.exports = service;
