document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  const sendBtn = document.getElementById('sendBtn');
  const promptInput = document.getElementById('promptInput');
  const loading = document.getElementById('loading');
  const result = document.getElementById('result');
  const quality = document.getElementById('quality');
  const suggestions = document.getElementById('suggestions');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const copyBtn = document.getElementById('copyBtn');
  const doneBtn = document.getElementById('doneBtn');

  function openModal() {
    modal.classList.remove('hidden');
    result.classList.add('hidden');
    loading.classList.add('hidden');
    promptInput.value = '';
  }
  function closeModalFn() {
    modal.classList.add('hidden');
  }

  analyzeBtn.onclick = openModal;
  closeModal.onclick = closeModalFn;
  doneBtn.onclick = closeModalFn;

  sendBtn.onclick = async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Cole um prompt para analisar!');
      return;
    }
    loading.classList.remove('hidden');
    result.classList.add('hidden');
    try {
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      loading.classList.add('hidden');
      if (data.error) {
        alert('Erro: ' + data.error);
        return;
      }
      quality.textContent = data.quality;
      suggestions.innerHTML = '';
      data.suggestions.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        suggestions.appendChild(li);
      });
      result.classList.remove('hidden');
    } catch (e) {
      loading.classList.add('hidden');
      alert('Erro ao conectar com a API.');
    }
  };

  copyBtn.onclick = () => {
    const text = `Categoria: ${quality.textContent}\nSugestões:\n- ` +
      Array.from(suggestions.children).map(li => li.textContent).join('\n- ');
    navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => copyBtn.textContent = 'Copiar', 1500);
  };

  exportPdfBtn.onclick = () => {
    import('jspdf').then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      doc.text('Resultado da Análise do Prompt', 10, 10);
      doc.text('Categoria: ' + quality.textContent, 10, 20);
      let y = 30;
      Array.from(suggestions.children).forEach(li => {
        doc.text('- ' + li.textContent, 10, y);
        y += 10;
      });
      doc.save('analise-prompt.pdf');
    });
  };
});
