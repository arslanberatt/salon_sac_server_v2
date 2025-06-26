const mongoose = require("mongoose");

const transactionCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["gider", "gelir"],
      required: true,
    },
  },
  { timestamps: false, collection: "transactionCategories" }
);

const transactionCategory = mongoose.model(
  "TransactionCategory",
  transactionCategorySchema
);
module.exports = transactionCategory;
