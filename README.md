# API de Gerenciamento de Pedidos

Projeto prático avaliativo de **Tópicos Avançados em Sistemas de Informação II**. API REST criada com Node.js, Express e JavaScript.

## Requisitos

- Node.js 18 ou superior
- npm (instalado junto com o Node.js)
- Postman para testes manuais (opcional para executar a API)

## Instalação e execução

No terminal, dentro da pasta do projeto:

```bash
npm install
npm start
```

A API ficará disponível em `http://localhost:3000`. Para executar os testes automatizados:

```bash
npm test
```

O armazenamento é em memória. Os pedidos são apagados quando o processo da API é reiniciado; não há banco de dados neste projeto.

## Arquitetura

- `src/routes/`: define os caminhos HTTP e encaminha para o controller.
- `src/controllers/`: recebe a requisição, chama o service e define o código HTTP da resposta.
- `src/services/`: concentra as regras de negócio, validações e armazenamento dos pedidos.
- `src/middlewares/error-handler.js`: centraliza as respostas de erro.
- `src/app.js`: configura Express, JSON, rotas e middlewares.
- `src/server.js`: inicia o servidor HTTP.
- `tests/`: testes automatizados com Jest e Supertest.
- `postman/`: coleção importável para testes manuais.
- `evidencias/`: local das capturas reais de tela solicitadas no enunciado.

## Rotas obrigatórias

| Método | Rota | Sucesso | Erros principais |
|---|---|---|---|
| POST | `/pedidos` | `201 Created` | `400 Bad Request` se os dados forem inválidos |
| GET | `/pedidos` | `200 OK` | — |
| GET | `/pedidos/:id` | `200 OK` | `404 Not Found` se o pedido não existir |
| PATCH | `/pedidos/:id/status` | `200 OK` | `400` para status/transição inválidos; `404` se o pedido não existir |

## Regras de dados

### Criar pedido — `POST /pedidos`

Corpo JSON de exemplo:

```json
{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

Regras aplicadas:

- `cliente`: texto obrigatório, não pode ficar vazio depois de remover espaços nas extremidades.
- `tipo`: deve ser `entrega` ou `retirada`.
- `valor`: deve ser um número maior que zero.
- `prioridade`: deve ser `normal`, `alta` ou `urgente`.
- O `id` é gerado pela API e o status inicial é `recebido`.

### Atualizar status — `PATCH /pedidos/:id/status`

Corpo JSON:

```json
{
  "status": "em_preparacao"
}
```

Status aceitos: `recebido`, `em_preparacao`, `enviado`, `entregue` e `cancelado`.

Transições permitidas neste projeto:

- `recebido` → `em_preparacao` ou `cancelado`
- `em_preparacao` → `enviado` ou `cancelado`
- `enviado` → `entregue`
- `entregue` → nenhum outro status
- `cancelado` → nenhum outro status

Essas regras foram definidas para o projeto e estão implementadas em `src/services/pedidos.service.js`.

## Exemplos de teste no Postman

Use a URL base `http://localhost:3000` e o header `Content-Type: application/json` quando enviar um corpo JSON.

1. Criar: `POST http://localhost:3000/pedidos` com o JSON de exemplo acima. Esperado: `201`.
2. Validar: repetir o POST com `"cliente": "   "`. Esperado: `400` e mensagem JSON.
3. Listar: `GET http://localhost:3000/pedidos`. Esperado: `200` e uma lista JSON.
4. Consultar inexistente: `GET http://localhost:3000/pedidos/999`. Esperado: `404`.
5. Atualizar: depois de criar um pedido, enviar `PATCH http://localhost:3000/pedidos/1/status` com `{"status":"em_preparacao"}`. Esperado: `200`.

A coleção de requisições está em `postman/colecao-api-pedidos.json`.

## Testes automatizados

Jest executa os testes definidos em `tests/pedidos.test.js`. Supertest envia requisições à aplicação sem precisar abrir uma porta de servidor. Os testes cobrem criação válida, validações, listagem, consulta, atualização permitida e erros de ID/transição.

## Evidências solicitadas

Salve capturas reais do Postman em `evidencias/` com os seguintes nomes sugeridos:

- `01-criacao.png` — POST válido, resposta `201`.
- `02-validacao.png` — POST inválido, resposta `400`.
- `03-listagem.png` — GET da lista, resposta `200`.
- `04-consulta-inexistente.png` — GET de ID inexistente, resposta `404`.
- `05-atualizacao.png` — PATCH de status válido, resposta `200`.

Os arquivos precisam mostrar método, URL, corpo quando aplicável, resposta e código HTTP. Não substitua as capturas por imagens ilustrativas: faça os testes com a API em execução.

## Git e GitHub

Não inclua `node_modules`, senhas, tokens ou credenciais no repositório. Faça commits reais durante o desenvolvimento, por exemplo: estrutura inicial; implementação das rotas; validações e regras de status; testes automatizados; documentação e coleção do Postman. Depois, crie um repositório no GitHub e envie o código.

## Uso de IA

Foi utilizada uma ferramenta de inteligência artificial como apoio para estruturar o projeto, elaborar uma primeira versão do código, sugerir validações, organizar os testes e redigir a documentação. O aluno deve executar e revisar todo o projeto, compreender as decisões e modificar o que for necessário. Uma decisão implementada foi separar rotas, controllers e services; isso ajuda a localizar cada responsabilidade e facilita manutenção e testes. Antes da entrega, registre com suas próprias palavras o que você verificou, aceitou, alterou ou rejeitou e por quê, para que a descrição corresponda ao seu processo real.
