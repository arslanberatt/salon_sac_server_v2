const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["gelir", "gider"],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    canceled: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
      default: null,
    },
    canceledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

const transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = transaction;
