const mongoose = require('mongoose');

const AdvanceRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // önemli
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ['beklemede', 'onaylandi', 'reddedildi'],
      default: 'beklemede',
    },
  },
  { timestamps: true, collection: 'advanceRequests' }
);

module.exports = mongoose.model('AdvanceRequest', AdvanceRequestSchema);
