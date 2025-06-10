// src/utils/analysis.js

// Helpers internos
const countMatches = (text, regex) => (text.match(regex) || []).length;

// Cálculo de legibilidade (Flesch–Kincaid simplificado)
export const calculateReadability = (words, sentences, syllables) => {
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

// Função principal de análise
export const performAnalysis = (text) => {
  const wordsArr = text.trim().split(/\s+/);
  const sentencesArr = text.split(/[.!?]+/).filter(s => s.trim());
  const wordsCount = wordsArr.length;
  const sentencesCount = sentencesArr.length || 1;
  const tokens = Math.ceil(wordsCount * 1.3);

  // Estimar sílabas
  const totalSyllables = wordsArr.reduce((sum, w) => sum + estimateSyllables(w), 0);

  // Scores existentes
  const clarityScore  = calculateClarity(text, sentencesArr);
  const contextScore  = calculateContext(text, wordsArr);
  const lengthScore   = calculateLengthScore(wordsCount, tokens);
  const focusScore    = calculateFocus(text, wordsArr);
  const sentimentObj  = analyzeSentiment(text, wordsArr);

  // Novas métricas
  const readabilityScore = calculateReadability(wordsCount, sentencesCount, totalSyllables);
  const complexityScore  = Math.max(0, Math.min(100,
    (passiveVoiceScore(text) + (totalSyllables / wordsCount) * 50)
  ));
  const keywordDensity   = calculateKeywordDensity(text, wordsArr);

  const overallScore = Math.round((
    clarityScore + contextScore + lengthScore +
    focusScore + sentimentObj.score + readabilityScore +
    (100 - complexityScore) + keywordDensity
  ) / 8);

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
      length:     { score: lengthScore,       label: 'Comprimento' },
      focus:      { score: focusScore,        label: 'Foco' },
      sentiment:  { score: sentimentObj.score, label: 'Tom', tone: sentimentObj.tone },
      readability:{ score: readabilityScore,  label: 'Legibilidade' },
      complexity: { score: complexityScore,   label: 'Complexidade' },
      keyword:    { score: keywordDensity,    label: 'Densidade de KW' }
    },
    suggestions: generateSuggestions({
      clarity: clarityScore,
      context: contextScore,
      length: lengthScore,
      focus: focusScore,
      sentiment: sentimentObj.score,
      readability: readabilityScore,
      complexity: complexityScore,
      keyword: keywordDensity
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

export const calculateLengthScore = (wc, tc) => {
  let score = 50;
  if (wc >= 30 && wc <= 180) score += 30;
  else if (wc < 30) score -= (30 - wc) * 1.5;
  else score -= (wc - 180) * 0.3;
  if (tc >= 35 && tc <= 260) score += 20;
  return Math.max(0, Math.min(100, score));
};

export const calculateFocus = (text, words) => {
  let score = 30;
  const verbs = ['crie','desenvolva','explique','liste','compare','avalie','gere','determine'];
  score += verbs.filter(v => text.includes(v)).length * 12;
  const goals = ['quero','preciso','objetivo','resultado','entregar'];
  if (goals.some(w => text.includes(w))) score += 18;
  const direct = ['por favor','você deve','é necessário','faça isso'];
  if (direct.some(w => text.includes(w))) score += 15;
  return Math.max(0, Math.min(100, score));
};

export const analyzeSentiment = (text) => {
  let score = 60, tone = 'neutro';
  const pos = ['incrível','fantástico','excelente','ótimo'];
  const neg = ['ruim','horrível','erro','falha'];
  const pCount = pos.filter(w => text.includes(w)).length;
  const nCount = neg.filter(w => text.includes(w)).length;
  if (pCount > nCount) { score += 20; tone = 'positivo'; }
  else if (nCount > pCount) { score -= 15; tone = 'negativo'; }
  if (countMatches(text, /\?+/g)) { score += 10; tone = 'interrogativo'; }
  return { score: Math.max(0,Math.min(100,score)), tone };
};

export const calculateKeywordDensity = (text, words) => {
  // 5 palavras-chave mais frequentes
  const freq = {};
  words.forEach(w => freq[w.toLowerCase().replace(/\W/g, '')] = (freq[w]||0)+1);
  const sorted = Object.values(freq).sort((a,b)=>b-a).slice(0,5);
  const dens = sorted.reduce((s,c)=>s + (c / words.length), 0) * 100;
  return Math.max(0, Math.min(100, Math.round(dens)));
};

export const generateSuggestions = (metrics, text) => {
  const s = [];
  if (metrics.clarity < 70)      s.push('Revise pontuação e evite voz passiva pra aumentar clareza.');
  if (metrics.context < 60)      s.push('Adicione contexto explícito (público, cenário, objetivo).');
  if (metrics.length < 60)       s.push('Abraçe um tamanho ideal: nem muito curto, nem prolixo.');
  if (metrics.focus < 60)        s.push('Use verbos de ação e objetivos claros.');
  if (metrics.sentiment < 60)    s.push('Insira tom positivo ou adequado ao público.');
  if (metrics.readability < 50)  s.push('Simplifique sentenças pra melhorar legibilidade.');
  if (metrics.complexity > 50)   s.push('Reduza voz passiva e termos excessivamente técnicos.');
  if (metrics.keyword < 20)      s.push('Inclua palavras-chave relevantes para foco.');
  if (!s.length) s.push('👏 Texto top! Considere refinamentos finos pra excelência.');
  return s;
};
