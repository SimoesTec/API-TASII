const express = require('express');
const pedidosRoutes = require('./routes/pedidos.routes');
const tratarErros = require('./middlewares/error-handler');

const app = express();

// Permite que o Express leia corpos de requisição no formato JSON.
app.use(express.json());

// Todas as rotas de pedidos começam com /pedidos.
app.use('/pedidos', pedidosRoutes);

// Responde quando a URL solicitada não existe.
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Middleware centralizado para padronizar as respostas de erro.
app.use(tratarErros);

module.exports = app;
