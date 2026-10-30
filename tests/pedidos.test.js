const request = require('supertest');
const app = require('../src/app');
const pedidosService = require('../src/services/pedidos.service');

const pedidoValido = {
  cliente: 'Carlos Silva',
  tipo: 'entrega',
  valor: 350,
  prioridade: 'normal'
};

beforeEach(() => {
  pedidosService.resetarDados();
});

describe('POST /pedidos', () => {
  test('cria pedido válido e responde com HTTP 201', async () => {
    const resposta = await request(app).post('/pedidos').send(pedidoValido);

    expect(resposta.status).toBe(201);
    expect(resposta.body).toMatchObject({
      id: 1,
      cliente: 'Carlos Silva',
      tipo: 'entrega',
      valor: 350,
      prioridade: 'normal',
      status: 'recebido'
    });
  });

  test('rejeita cliente vazio com HTTP 400', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({ ...pedidoValido, cliente: '   ' });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toMatch(/cliente/i);
  });

  test('rejeita valor zero com HTTP 400', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({ ...pedidoValido, valor: 0 });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toMatch(/valor/i);
  });

  test('rejeita tipo não reconhecido com HTTP 400', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({ ...pedidoValido, tipo: 'correio' });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toMatch(/tipo/i);
  });
});

describe('GET /pedidos', () => {
  test('lista os pedidos cadastrados com HTTP 200', async () => {
    await request(app).post('/pedidos').send(pedidoValido);
    const resposta = await request(app).get('/pedidos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].cliente).toBe('Carlos Silva');
  });
});

describe('GET /pedidos/:id', () => {
  test('consulta um pedido existente com HTTP 200', async () => {
    await request(app).post('/pedidos').send(pedidoValido);
    const resposta = await request(app).get('/pedidos/1');

    expect(resposta.status).toBe(200);
    expect(resposta.body.id).toBe(1);
  });

  test('responde HTTP 404 quando o ID não existe', async () => {
    const resposta = await request(app).get('/pedidos/999');

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toMatch(/não encontrado/i);
  });
});

describe('PATCH /pedidos/:id/status', () => {
  test('atualiza status quando a transição é permitida', async () => {
    await request(app).post('/pedidos').send(pedidoValido);
    const resposta = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'em_preparacao' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe('em_preparacao');
  });

  test('rejeita transição de status inválida com HTTP 400', async () => {
    await request(app).post('/pedidos').send(pedidoValido);
    const resposta = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'entregue' });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toMatch(/não é possível alterar/i);
  });

  test('rejeita atualização de ID inexistente com HTTP 404', async () => {
    const resposta = await request(app)
      .patch('/pedidos/999/status')
      .send({ status: 'cancelado' });

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toMatch(/não encontrado/i);
  });
});
