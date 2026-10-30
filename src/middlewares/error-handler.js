function tratarErros(erro, req, res, next) {
  // Erros de JSON malformado do express.json normalmente possuem status 400.
  const status = Number.isInteger(erro.status) ? erro.status : 500;

  if (status >= 500) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }

  if (status === 400 && erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido. Verifique o corpo da requisição.' });
  }

  return res.status(status).json({ erro: erro.message || 'Não foi possível processar a requisição.' });
}

module.exports = tratarErros;
