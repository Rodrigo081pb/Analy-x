const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

// Mock do endpoint para teste
app.post('/analyze', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'O campo "prompt" é obrigatório e deve ser uma string não vazia.' });
  res.json({ quality: 'Bom', suggestions: ['Melhore a clareza do prompt.'] });
});

describe('POST /analyze', () => {
  it('deve retornar qualidade e sugestões para um prompt válido', async () => {
    const res = await request(app)
      .post('/analyze')
      .send({ prompt: 'Explique a teoria da relatividade.' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('quality');
    expect(res.body).toHaveProperty('suggestions');
  });

  it('deve retornar erro para prompt vazio', async () => {
    const res = await request(app)
      .post('/analyze')
      .send({ prompt: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
