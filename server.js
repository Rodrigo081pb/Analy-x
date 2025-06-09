require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de validação do payload
function validatePrompt(req, res, next) {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório e deve ser uma string não vazia.' });
  }
  next();
}

// Função para mapear score para categoria
function mapScoreToQuality(score) {
  if (score >= 0.85) return 'Ótimo';
  if (score >= 0.7) return 'Bom';
  if (score >= 0.5) return 'Médio';
  return 'Ruim';
}

// Função para gerar sugestões de melhoria
function generateSuggestions(iaText) {
  const suggestions = [];
  if (!/claro|claridade|clara/i.test(iaText)) suggestions.push('Melhore a clareza do prompt.');
  if (!/contexto/i.test(iaText)) suggestions.push('Adicione mais contexto.');
  if (!/detalhe|detalhado/i.test(iaText)) suggestions.push('Inclua detalhes específicos.');
  if (suggestions.length === 0) suggestions.push('Seu prompt já está muito bom!');
  return suggestions;
}

// Endpoint principal
app.post('/analyze', validatePrompt, async (req, res) => {
  const { prompt } = req.body;
  try {
    // Exemplo usando Hugging Face Inference API (substitua pelo seu endpoint real)
    const iaResponse = await axios.post(
      process.env.IA_API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${process.env.IA_API_KEY}` } }
    );
    // Simulação: extraia score e texto da IA
    const iaResult = iaResponse.data;
    // Ajuste conforme o formato real da resposta da IA
    const score = iaResult.score || 0.7; // Exemplo
    const iaText = iaResult.text || iaResult.choices?.[0]?.text || JSON.stringify(iaResult);
    const quality = mapScoreToQuality(score);
    const suggestions = generateSuggestions(iaText);
    res.json({ quality, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao analisar o prompt com a IA.' });
  }
});

// Middleware de erro genérico
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Analy X API rodando na porta ${PORT}`);
});
