// src/utils/analysis.js

// Helpers internos
const countMatches = (text, regex) => (text.match(regex) || []).length;

// Cálculo de legibilidade (Flesch–Kincaid simplificado)
const calculateReadability = (words, sentences, syllables) => {
  // FKGL = 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  const fkgl = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.max(0, Math.min(100, 100 - fkgl)); // transformar em 0–100
};

// Contagem aproximada de sílabas
const estimateSyllables = (word) => {
  word = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  const sy = word.match(/[aeiouy]{1,2}/g);
  return sy ? sy.length : 1;
};

// Detecção passiva (bem básica)
const passiveVoiceScore = (text) => {
  const passiveMatches = countMatches(text, /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi);
  return Math.min(20, passiveMatches * 5); // penaliza até 20 pontos
};

// Lista simples de xingamentos/proibidos (pode ser expandida)
const BAD_WORDS = [
  'burro', 'idiota', 'merda', 'bosta', 'otário', 'fdp', 'porra', 'caralho', 'desgraça', 'imbecil', 'lixo', 'palhaço', 'babaca', 'corno', 'puta', 'vagabundo', 'arrombado', 'macaco', 'viado', 'racista', 'preconceito', 'preconceituoso', 'xingar', 'xingamento', 'palavrão', 'palavrões'
];

function hasBadWords(text) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(w => lower.includes(w));
}

function isPromptValid(text) {
  const wordsArr = text.trim().split(/\s+/);
  if (wordsArr.length < 4) return false;
  if (hasBadWords(text)) return false;
  // Pode adicionar mais regras aqui (ex: frases completas)
  return true;
}

// Função principal de análise
export const performAnalysis = (text) => {
  if (!isPromptValid(text)) {
    return {
      id: Date.now(),
      timestamp: new Date().toLocaleString('pt-BR'),
      text: text.slice(0, 120) + (text.length > 120 ? '…' : ''),
      fullText: text,
      wordCount: text.trim().split(/\s+/).length,
      tokenCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      overallScore: 0,
      metrics: {
        clarity:    { score: 0, label: 'Clareza' },
        context:    { score: 0, label: 'Contexto' },
        readability:{ score: 0, label: 'Legibilidade' }
      },
      suggestions: [
        hasBadWords(text)
          ? 'Seu prompt contém palavras inadequadas. Por favor, reformule sem xingamentos ou termos ofensivos.'
          : 'Seu prompt é muito curto ou não faz sentido. Digite pelo menos 4 palavras/frases completas para receber sugestões.'
      ]
    };
  }
  const wordsArr = text.trim().split(/\s+/);
  const sentencesArr = text.split(/[.!?]+/).filter(s => s.trim());
  const wordsCount = wordsArr.length;
  const sentencesCount = sentencesArr.length || 1;
  const tokens = Math.ceil(wordsCount * 1.3);
  const totalSyllables = wordsArr.reduce((sum, w) => sum + estimateSyllables(w), 0);
  const clarityScore  = calculateClarity(text, sentencesArr);
  const contextScore  = calculateContext(text, wordsArr);
  const readabilityScore = calculateReadability(wordsCount, sentencesCount, totalSyllables);
  const overallScore = Math.round((clarityScore + contextScore + readabilityScore) / 3);
  return {
    id: Date.now(),
    timestamp: new Date().toLocaleString('pt-BR'),
    text: text.slice(0, 120) + (text.length > 120 ? '…' : ''),
    fullText: text,
    wordCount: wordsCount,
    tokenCount: tokens,
    sentenceCount: sentencesCount,
    syllableCount: totalSyllables,
    overallScore,
    metrics: {
      clarity:    { score: clarityScore,      label: 'Clareza' },
      context:    { score: contextScore,      label: 'Contexto' },
      readability:{ score: readabilityScore,  label: 'Legibilidade' }
    },
    suggestions: generateSuggestions({
      clarity: clarityScore,
      context: contextScore,
      readability: readabilityScore
    }, text)
  };
};

// ==== MÉTRICAS REPAGINADAS ====

export const calculateClarity = (text, sentences) => {
  let score = 50;
  const punctCount = countMatches(text, /[.!?;,–]/g);
  const punctRatio = (punctCount / text.length) * 100;
  if (punctRatio > 3 && punctRatio < 7) score += 15;
  const avgLen = text.length / sentences.length;
  if (avgLen > 30 && avgLen < 120) score += 10;
  const buzz = ['portanto','além disso','consequentemente','entretanto'];
  if (buzz.some(w => text.includes(w))) score += 5;
  score -= passiveVoiceScore(text);
  return Math.max(0, Math.min(100, score));
};

export const calculateContext = (text, words) => {
  let score = 40;
  const ctxWords = ['contexto','cenário','público-alvo','objetivo','meta','propósito'];
  score += ctxWords.filter(w => text.toLowerCase().includes(w)).length * 8;
  const specificity = ['específico','detalhado','preciso','particular'];
  if (specificity.some(w => text.includes(w))) score += 12;
  const examples = ['por exemplo','tipo','igual','similar'];
  if (examples.some(w => text.includes(w))) score += 10;
  return Math.max(0, Math.min(100, score));
};

// Ajusta sugestões para só as métricas mantidas
export const generateSuggestions = (metrics, text) => {
  const s = [];
  if (metrics.clarity < 70)      s.push('Revise pontuação e evite voz passiva pra aumentar clareza.');
  if (metrics.context < 60)      s.push('Adicione contexto explícito (público, cenário, objetivo).');
  if (metrics.readability < 50)  s.push('Simplifique sentenças pra melhorar legibilidade.');
  if (!s.length) s.push('👏 Texto top! Considere refinamentos finos pra excelência.');
  return s;
};
