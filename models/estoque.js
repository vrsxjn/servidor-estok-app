const mongoose = require('mongoose');
const { Schema } = mongoose;

// Model Estoque
const estoqueSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  descricao: {
    type: String,
    required: true
  },
  quantidade_total: {
    type: Number,
    required: true
  },
  data_entrada: {
    type: Date,
    required: true
  },
  data_validade: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  status_estoque: {
    type: String
  },
  produtos: [{ type: Schema.Types.ObjectId, ref: 'Produto' }]
});


module.exports = mongoose.model('Estoque', estoqueSchema);
