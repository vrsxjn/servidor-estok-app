const mongoose = require('mongoose');

// Model Image
const imageSchema = new mongoose.Schema({
  file_name: String,
  mime_type: String,
  base64: String,
});


module.exports = mongoose.model('Image', imageSchema);

