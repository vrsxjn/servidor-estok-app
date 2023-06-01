const mongoose = require('mongoose');
let url = "mongodb://127.0.0.1:27017/estok_app";


mongoose.connect(url, {})
  .then(() => {
    console.log('Conectado ao mongo');
  })
  .catch((error) => {
    console.error('Erro:', error);
  });

module.exports = mongoose.connection;
