# Como rodar o projeto Analy X

1. **Copie o arquivo `.env.example` para `.env` e preencha sua chave de API:**
   
   ```powershell
   copy .env.example .env
   # Edite o arquivo .env e coloque sua IA_API_KEY
   ```

2. **Instale as dependências:**
   ```powershell
   npm install
   ```

3. **Rode o servidor local:**
   ```powershell
   npm start
   ```
   Acesse http://localhost:3001 no navegador.

4. **Rode os testes:**
   ```powershell
   npm test
   ```

5. **Deploy no Vercel:**
   - Instale o Vercel CLI: `npm install -g vercel`
   - Faça login: `vercel login`
   - Faça deploy: `vercel --prod`

---

- O front-end está em `/public`.
- O endpoint principal é `POST /analyze`.
- Para exportar PDF no front-end, o jsPDF já está incluído via import dinâmico.
