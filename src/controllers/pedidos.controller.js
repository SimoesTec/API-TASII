const pedidosService = require('../services/pedidos.service');

function criar(req, res, next) {
  try {
    const pedido = pedidosService.criarPedido(req.body);
    return res.status(201).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

function listar(req, res, next) {
  try {
    return res.status(200).json(pedidosService.listarPedidos());
  } catch (erro) {
    return next(erro);
  }
}

function buscarPorId(req, res, next) {
  try {
    const pedido = pedidosService.buscarPedidoPorId(req.params.id);
    return res.status(200).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

function atualizarStatus(req, res, next) {
  try {
    const pedido = pedidosService.atualizarStatus(req.params.id, req.body);
    return res.status(200).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

module.exports = { criar, listar, buscarPorId, atualizarStatus };
