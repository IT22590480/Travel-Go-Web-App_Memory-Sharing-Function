const mongoose = require("mongoose");

// Image Schema
const ImageSchema = new mongoose.Schema({
    image: [String],
    location: String,
    date: String,
    description: String,
    viewCount: {
      type: Number,
      default: 0 // Default value for viewCount
  }
    
    
  });
  const Image = mongoose.model("Image", ImageSchema);
  module.exports = Image
  