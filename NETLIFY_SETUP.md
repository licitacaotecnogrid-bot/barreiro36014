# 🚀 Guia de Deploy no Netlify

## ⚠️ Por que eventos/projetos não populam o banco?

Quando você faz deploy, o banco de dados **não está configurado no Netlify**. A API não consegue salvar dados sem uma conexão válida ao banco.

## ✅ Solução: Configurar o Banco de Dados

### Opção 1: Usar Supabase (Recomendado) 🌟

1. **Criar conta no Supabase**
   - Vá para: https://supabase.com
   - Clique em "Sign Up"
   - Escolha GitHub para autenticação rápida

2. **Criar novo projeto**
   - Clique em "New Project"
   - Escolha a região (ex: South America - São Paulo)
   - Aguarde o projeto ser criado

3. **Obter DATABASE_URL**
   - Na dashboard, clique em "Project Settings" (gear icon)
   - Vá para "Database"
   - Copie a "Connection string" (escolha "URI" com [user], [password] e [database])
   - Será algo como: `postgresql://postgres:[PASSWORD]@db.[REGION].supabase.co:5432/postgres`

4. **Copiar para Netlify**
   - No Netlify, vá para: **Site Settings** → **Build & Deploy** → **Environment**
   - Clique em **Add variable**
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a string copiada do Supabase
   - Clique em **Save**

5. **Executar migrations no Supabase**
   ```bash
   # Localmente, com DATABASE_URL do Supabase
   DATABASE_URL="postgresql://..." pnpm prisma migrate deploy
   ```

### Opção 2: Usar Neon (PostgreSQL como serviço)

1. **Criar conta no Neon**
   - Vá para: https://neon.tech
   - Sign up com GitHub

2. **Criar novo projeto**
   - Clique em "New Project"
   - Copie a "Connection string"

3. **Adicionar ao Netlify**
   - Mesmo passo acima (Site Settings → Environment)
   - Key: `DATABASE_URL`
   - Value: Sua connection string do Neon

### Opção 3: Usar SQLite em arquivo (Não funciona no Netlify)

❌ **Não recomendado** - SQLite precisa de filesystem persistente, que Netlify não oferece.

---

## 🔧 Configurar Variáveis de Ambiente no Netlify

### Passo a Passo Completo:

1. **Acessar Site Settings**
   ```
   netlify.com → Seu Site → Site Settings
   ```

2. **Ir para Build & Deploy**
   ```
   Site Settings → Build & Deploy → Environment
   ```

3. **Adicionar Variáveis (clique em "Add variable")**
   
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres` |
   | `NODE_ENV` | `production` |
   | `PING_MESSAGE` | `pong` |

4. **Salvar e Fazer Redeploy**
   - Clique em "Save"
   - Vá para: **Deploys**
   - Clique em **Trigger Deploy** → **Deploy site**

---

## ✨ Verificar se Funcionou

1. **Acessar sua aplicação**
   - `https://seu-site.netlify.app`

2. **Criar um evento**
   - Clique em "Novo Evento"
   - Preencha os campos
   - Clique em "Criar"

3. **Verificar se salvou**
   - Volte para Eventos
   - O novo evento deve aparecer na lista

4. **Se não funcionar, verificar logs**
   - No Netlify: **Deploys** → Clique no último deploy
   - Vá para **Deploy log**
   - Procure por erros (vermelho)

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"

**Causa**: DATABASE_URL não configurada ou inválida

**Solução**:
- Verifique se copiou a string completa
- Teste a conexão: `psql "sua-connection-string-aqui"`
- Se não funcionar, regenere a senha no Supabase/Neon

### Erro: "P1002: The provided database string is invalid"

**Causa**: Falta a parte de autenticação na URL

**Solução**: Use o formato completo:
```
postgresql://postgres:[PASSWORD]@db.[REGION].supabase.co:5432/postgres
```

### Funcionando localmente mas não em produção

**Causa**: Migrations não rodaram no banco remoto

**Solução**:
```bash
# Rodar migrations no banco remoto
DATABASE_URL="sua-url-remota" pnpm prisma migrate deploy
```

### Dados aparecem local mas desaparecem em produção

**Causa**: Usando SQLite que se reseta a cada deploy

**Solução**: Migrar para Supabase/Neon (veja Opção 1 ou 2 acima)

---

## 📝 Comandos Úteis

```bash
# Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# Rodar migrations
pnpm prisma migrate deploy

# Ver estado do banco
pnpm prisma db push

# Seed do banco com dados de teste
pnpm db:seed

# Verificar banco via Prisma Studio (GUI)
pnpm prisma studio
```

---

## ✅ Checklist Final

- [ ] Criou conta no Supabase/Neon
- [ ] Copiou DATABASE_URL
- [ ] Adicionou DATABASE_URL no Netlify
- [ ] Rodou migrations no banco remoto
- [ ] Fez redeploy da aplicação
- [ ] Testou criar um evento
- [ ] Evento foi salvo com sucesso

**Pronto! 🎉 Agora eventos e projetos serão salvos em produção.**
