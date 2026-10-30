const TIPOS_PERMITIDOS = ['entrega', 'retirada'];
const PRIORIDADES_PERMITIDAS = ['normal', 'alta', 'urgente'];
const STATUS_PERMITIDOS = [
  'recebido',
  'em_preparacao',
  'enviado',
  'entregue',
  'cancelado'
];

// As transições possíveis ficam documentadas e centralizadas aqui.
const TRANSICOES = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: []
};

// Armazenamento em memória, permitido pelo enunciado do projeto.
let pedidos = [];
let proximoId = 1;

function criarErro(status, mensagem) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function criarPedido(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw criarErro(400, 'O corpo da requisição deve ser um objeto JSON.');
  }

  const { cliente, tipo, valor, prioridade } = dados;

  if (typeof cliente !== 'string' || cliente.trim() === '') {
    throw criarErro(400, 'O campo cliente é obrigatório e não pode ficar vazio.');
  }

  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
    throw criarErro(400, 'O campo valor deve ser um número maior que zero.');
  }

  if (!TIPOS_PERMITIDOS.includes(tipo)) {
    throw criarErro(400, `O campo tipo deve ser um destes valores: ${TIPOS_PERMITIDOS.join(', ')}.`);
  }

  if (!PRIORIDADES_PERMITIDAS.includes(prioridade)) {
    throw criarErro(400, `O campo prioridade deve ser um destes valores: ${PRIORIDADES_PERMITIDAS.join(', ')}.`);
  }

  const pedido = {
    id: proximoId++,
    cliente: cliente.trim(),
    tipo,
    valor,
    prioridade,
    status: 'recebido'
  };

  pedidos.push(pedido);
  return { ...pedido };
}

function listarPedidos() {
  // Retorna cópias para evitar que uma resposta altere os objetos armazenados.
  return pedidos.map((pedido) => ({ ...pedido }));
}

function buscarPedidoPorId(idInformado) {
  const id = Number(idInformado);
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(404, 'Pedido não encontrado.');
  }

  const pedido = pedidos.find((item) => item.id === id);
  if (!pedido) {
    throw criarErro(404, 'Pedido não encontrado.');
  }

  return { ...pedido };
}

function atualizarStatus(idInformado, dados) {
  const id = Number(idInformado);
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(404, 'Pedido não encontrado.');
  }

  const pedido = pedidos.find((item) => item.id === id);
  if (!pedido) {
    throw criarErro(404, 'Pedido não encontrado.');
  }

  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw criarErro(400, 'O corpo da requisição deve conter o campo status.');
  }

  const { status } = dados;
  if (!STATUS_PERMITIDOS.includes(status)) {
    throw criarErro(400, `O campo status deve ser um destes valores: ${STATUS_PERMITIDOS.join(', ')}.`);
  }

  const transicoesPossiveis = TRANSICOES[pedido.status];
  if (!transicoesPossiveis.includes(status)) {
    throw criarErro(400, `Não é possível alterar o status de "${pedido.status}" para "${status}".`);
  }

  pedido.status = status;
  return { ...pedido };
}

// Auxiliar usado pelos testes automatizados para começar cada teste sem dados antigos.
function resetarDados() {
  pedidos = [];
  proximoId = 1;
}

module.exports = {
  criarPedido,
  listarPedidos,
  buscarPedidoPorId,
  atualizarStatus,
  resetarDados
};
