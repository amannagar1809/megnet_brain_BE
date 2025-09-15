const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  status:{
    type: Boolean,
    required : false,
    default: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Index for category filtering
productSchema.index({ category: 1 });

// Index for price sorting
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
