const mongoose = require('mongoose');

// Model User
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);