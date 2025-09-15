const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
    status:{
    type: Boolean,
    required : false,
    default: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paypalOrderId: {
    type: String,
  },
  paypalTransactionId: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for order number lookup
orderSchema.index({ orderNumber: 1 });

// Index for status filtering
orderSchema.index({ status: 1 });

// Index for date sorting
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
