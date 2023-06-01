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
