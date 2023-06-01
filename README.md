# API de Controle de Estoque e Produtos

Este repositório contém a documentação da API de Controle de Estoque e Produtos, que permite gerenciar o estoque de produtos e realizar operações relacionadas, como registro de usuários, autenticação, adição, alteração e remoção de estoques e produtos.

## Endpoints

A seguir, estão listados os endpoints disponíveis nesta API, juntamente com as informações necessárias para fazer chamadas a cada um deles.

### Autenticação (AUTH)

**Registrar um usuário**

- Método: `POST`
- URL: `http://localhost:3000/auth/register`
- Token necessário: Não

**Requisição:**

{
"nome": "Roberto Gabriel",
"email": "beto.secanechia@hotmail.com",
"senha": "12345678",
"telefone": "(11) 954803188"
}

**Login do usuário**

- Método: `POST`
- URL: `http://localhost:3000/auth/login`
- Token necessário: Não

**Requisição:**

{
"email": "beto.secanechia@hotmail.com",
"senha": "12345678"
}

**Logout do usuário**

- Método: `POST`
- URL: `http://localhost:3000/auth/logout`
- Token necessário: Sim

### Estoque (ESTOQUE)

**Listar estoques**

- Método: `GET`
- URL: `http://localhost:3000/estoques/`
- Token necessário: Sim

**Adicionar estoque**

- Método: `POST`
- URL: `http://54.90.203.92/estoques/`
- Token necessário: Sim

**Requisição:**

{
"descricao": "BEBIDAS CERVEJA Kaiser",
"quantidade_total": 10,
"data_entrada": "2022-03-13 14:20:28.000000",
"data_validade": "2023-03-13 14:20:28.000000",
"tipo": "Grade"
}

**Alterar estoque**

- Método: `PUT`
- URL: `http://localhost:3000/estoques/`
- Token necessário: Sim

**Requisição:**

{
"id": 9,
"descricao": "Bebidas sucos",
"quantidade_total": 20,
"data_entrada": "2023-03-20 14:20:28.000000",
"data_validade": "2024-03-13 14:20:28.000000",
"tipo": "GRADE"
}

**Remover estoque**

- Método: `DELETE`
- URL: `http://localhost:3000/estoques/20` (onde 20 é o ID do estoque)
- Token necessário: Sim

Obs: Essa operação também remove todos os produtos relacionados a este estoque (Cascade).

### Produtos (PRODUTOS)

**Listar produtos de um estoque**

- Método: `GET`
- URL: `http://localhost:3000/estoques/13/produtos/` (onde 13 é o ID do estoque)
- Token necessário: Sim

**Adicionar produto a um estoque**

- Método: `POST`
- URL: `http://localhost:3000/estoques/13/produtos/` (onde 13 é o ID do estoque)
- Token necessário: Sim

**Requisição:**

{
"nome": "COCA COLA - 1L",
"descricao": "Uma das melhores marcas em uma casa só",
"imagem": "/xtudo_suco.jpeg",
"valor_item": 45.0,
"valor_unitario": 5.50,
"quantidade": 2,
"site": "www.heineken.com.br"
}

**Alterar produto de um estoque**

- Método: `PUT`
- URL: `http://localhost:3000/estoques/13/produtos/` (onde 13 é o ID do estoque)
- Token necessário: Sim

**Requisição:**

{
"id": 5,
"nome": "COCA COLA testetses",
"descricao": "Uma das melhores",
"imagem": "/xtudo_suco.jpeg",
"valor_item": 45.0,
"valor_unitario": 7.5,
"quantidade": 10,
"site": "www.heineken.com.br"
}

**Remover produto de um estoque**

- Método: `DELETE`
- URL: `http://localhost:3000/estoques/13/produtos/7` (onde 13 é o ID do estoque e 7 é o ID do produto)
- Token necessário: Sim

### Imagens (IMAGES)

**Obter imagem**

- Método: `GET`
- URL: `http://localhost:3000/images/<NOME-DA-IMAGEM-SALVA>.jpeg` (a URL é devolvida completa sem necessidade de interpolação)
- Token necessário: Não

**Adicionar imagem**

- Método: `POST`
- URL: `http://localhost:3000/images/upload`
- Token necessário: Sim

**Requisição:**

{
"file_name": "nomedoarquivo",
"mime_type": "image/jpeg",
"base64": "/9j/4AAQSkZJRgABAQEAYABgAAD/" // base64 deve ter a imagem codificada em base64, conforme visto em aula
}

## Considerações Finais

Essa API foi desenvolvida para facilitar o controle de estoque e gerenciamento de produtos. Sinta-se à vontade para utilizar os endpoints disponíveis e contribuir para melhorias deste projeto. Em caso de dúvidas ou problemas, entre em contato.
