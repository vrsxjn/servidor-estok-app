const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); 
const Estoque = require('./models/estoque'); 
const Produto = require('./models/produto');
const Image = require('./models/image'); 

const app = express();
app.use(bodyParser.json());

var jwt = 'teste123'

// Autenticação do token
const authenticateToken = (req, res, next) => {  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({status: 401, message: 'Acesso negado, Token de autorização não fornecido'});
  }

  jwt.verify(token, jdw, (err, decoded) => {
    if (err) {
      return res.status(401).json({status: 401,  message: 'Acesso negado, Token de autorização invalido'});
    }

    const userId = decoded.userId;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(401).json({status: 401, message: 'Acesso negado, Usuario não encontrado.'});
        }
        req.userId = userId;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({status: 401 , message: 'Erro ao procurar usuario no banco de dados'});
      });
  });
};
/////

// Auth User
app.post('/auth/register', (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha || !telefone) {
    return res.status(400).json({status: 400, message: 'Todos os campos são obrigatorios'});
  }

  const novoUsuario = new User({
    nome,
    email,
    senha,
    telefone,
  });

  novoUsuario.save()
    .then(() => {
      res.status(201).json({status: 200, message: 'Usuario registrado com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: 500, message: 'Ero ao salvar o usuario'});
    });
});


app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({status: 400, message: 'Email e senha são obrigatorios'});
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({status: 404, message: 'Usuario não encontrado'});
      }

      if (user.senha !== senha) {
        return res.status(401).json({status: 401, message: 'Senha incorreta'});
      }

      const token = jwt.sign({ userId: user._id }, jdw);

      user.token = token;
      return user.save()
        .then(() => {
          res.status(200).json({ nome: user.nome, telefone: user.telefone, email: user.email, token });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500 ,message: 'Erro ao fazer login'});
    });
});

app.post('/auth/logout', (req, res) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({status: 400, message: 'Token e obrigatorio'});
  }
  
  token = token.replace("Bearer ", "");

  User.findOne({ token })
    .then((user) => {
      if (!user) {
        return res.status(404).json({status: 404, message: 'ussuario não encontrado'});
      }

      user.token = undefined;

      return user.save();
    })
    .then(() => {
      res.status(200).json({status: 200, message: 'logout realizado com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao remover o token'});
    });
});
/////
// Estoques
app.get('/estoques', authenticateToken, (req, res) => {
  Estoque.find()
    .then((estoques) => {
      res.status(200).json(estoques);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao buscar estoques'});
    });
});

app.post('/estoques', authenticateToken, async (req, res) => {
  const count = await Estoque.countDocuments();
  const { descricao, quantidade_total, data_entrada, data_validade, tipo } = req.body;

  const novoEstoque = new Estoque({
    id: count + 1,
    descricao,
    quantidade_total,
    data_entrada,
    data_validade,
    tipo,
    status_estoque: "EM FALTA"
  });

  novoEstoque.save()
    .then(() => {
      res.status(201).json({status: 201, message: 'Estoque adicionado com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao adicionar estoque'});
    });
});

app.put('/estoques', authenticateToken, (req, res) => {
  const { id, descricao, quantidade_total, data_entrada, data_validade, tipo } = req.body;

  Estoque.findOneAndUpdate({ id }, {
    descricao,
    quantidade_total,
    data_entrada,
    data_validade,
    tipo
  })
    .then((estoque) => {
      if (!estoque) {
        return res.status(404).json({status: 404, message: 'Estoque não encontrado'});
      }

      if (estoque.quantidade_total === 0) {
        estoque.status_estoque = 'EM FALTA';
      } else if (estoque.quantidade_total > 1 && estoque.quantidade_total < 5) {
        estoque.status_estoque = 'EM AVISO';
      } else {
        estoque.status_estoque = 'EM ESTOQUE';
      }

      return estoque.save();
    })
    .then(() => {
      res.status(200).json({status: 200, message: 'Estoque atualizado com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao atualizar estoque'});
    });
});

app.delete('/estoques/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  Estoque.findOneAndRemove({ id })
    .then((estoque) => {
      if (!estoque) {
        return res.status(404).json({status: 404, message: 'Estoque não encontrado'});
      }

      res.status(200).json({status: 200, message: 'Estoque excluído com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: 500, message: 'Erro ao excluir estoque'});
    });
});
/////
// Produtos
app.get('/estoques/:id/produtos', (req, res) => {
  const { id } = req.params;

  Estoque.findOne({ id: id })
    .populate('produtos')
    .exec()
    .then((estoque) => {
      if (!estoque) {
        return res.status(404).json({status: 404, message: 'Estoque não encontrado'});
      }

      res.status(200).json(estoque.produtos);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao listar produtos do estoque'});
    });
});

app.post('/estoques/:id/produtos', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, imagem, valor_item, valor_unitario, quantidade, site } = req.body;

  Estoque.findOne({ id: id })
    .then(async (estoque) => {
      if (!estoque) {
        return res.status(404).json({status: 404, message: 'Estoque não encontrado'});
      }

      const count = await Produto.countDocuments();

      const novoProduto = new Produto({
        id: count + 1,
        nome,
        descricao,
        imagem,
        valor_item,
        valor_unitario,
        quantidade,
        site,
        estoque: estoque._id
      });
		
      novoProduto.save()
        .then(produto => {
          estoque.produtos.push(produto);
          return estoque.save();
        })
        .then(() => {
          res.status(200).json({ status: 200, message: 'Produto adicionado ao estoque com sucesso'});
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({status: 500, message: 'Erro ao adicionar produto ao estoque'});
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ status: 500, message: 'Erro ao adicionar produto ao estoque'});
    });
});

app.put('/estoques/:id/produtos', authenticateToken, (req, res) => {
  const { id , nome, descricao, imagem, valor_item, valor_unitario, quantidade, site } = req.body;

  Produto.findOneAndUpdate({ id }, {
    nome,
    descricao,
    imagem,
    valor_item,
    valor_unitario,
    quantidade,
    site
  })
    .then((produto) => {
      if (!produto) {
        return res.status(404).json({status: 404, message: 'Produto não encontrado'});
      }

      res.status(200).json({status: 200, message: 'Produto atualizado com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao atualizar produto'});
    });
});

app.delete('/estoques/:estoqueId/produtos/:produtoId', (req, res) => {
  const { estoqueId, produtoId } = req.params;

  Estoque.findOne({ id: estoqueId })
    .then((estoque) => {
      if (!estoque) {
        return res.status(404).json({status: 404, message: 'Estoque não encontrado'});
      }

      estoque.produtos = estoque.produtos.filter((produto) => produto != produtoId);

      return estoque.save();
    })
    .then(() => {
      return Produto.findOneAndDelete({ id: produtoId });
    })
    .then((produto) => {
      if (!produto) {
        return res.status(404).json({status: 404, message: 'Produto não encontrado'});
      }

      res.status(200).json({status: 200, message: 'Produto removido do estoque com sucesso'});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao remover produto do estoque'});
    });
});
/////
// Imagem
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;

  Image.findOne({ file_name: imageName })
    .then((image) => {
      if (!image) {
        return res.status(404).json({status: 404, message: 'Imagem não encontrada'});
      }

      res.setHeader('Content-Type', image.mime_type);
      res.send(Buffer.from(image.base64, 'base64'));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao encontra a imagem'});
    });
});

app.post('/images/upload', authenticateToken, (req, res) => {
  const { file_name, mime_type, base64 } = req.body;

  const novaImage = new Image({
    file_name,
    mime_type,
    base64,
  });

  novaImage.save()
    .then((savedImage) => {
      const imageUrl = `http://10.0.2.2:3000/images/${file_name}`;

      savedImage.url_image = imageUrl;
      return savedImage.save();
    })
    .then((updatedImage) => {
      res.status(200).json({status: 200, message: 'Imagem adicionada com sucesso', url_image: updatedImage.url_image });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({status: 500, message: 'Erro ao adicionar imagem'});
    });
});
/////
// Banco d Dados, Liga api
db.once('open', () => {
  app.listen(3000, () => {
    console.log('Servidor ligado PORTA: 3000');
  });
});