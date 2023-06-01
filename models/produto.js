const mongoose = require('mongoose');

// Model Produto
const produtoSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  imagem: {
    type: String
  },
  valor_item: {
    type: Number,
    required: true
  },
  valor_unitario: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    required: true
  },
  site: {
    type: String
  },
  estoque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estoque',
    required: true
  }
});


module.exports = mongoose.model('Produto', produtoSchema);
