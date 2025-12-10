# 🔧 Configuração Supabase + Netlify

## Seus Dados Supabase

```
URL: db.ydxusofevdsbfjakwvvj.supabase.co
Projeto: ydxusofevdsbfjakwvvj
Dashboard: https://supabase.com/dashboard/project/ydxusofevdsbfjakwvvj
```

## ⚠️ IMPORTANTE - SENHA

1. Vá para o **Supabase Dashboard**
2. Selecione o projeto **ydxusofevdsbfjakwvvj**
3. Clique em **Project Settings** (engrenagem no canto)
4. Vá para **Database**
5. Procure por **Database password** e clique em **Reset password**
6. Copie a nova senha
7. Use na connection string abaixo

## ✅ Passo 1: Configurar Localmente

### 1.1 Editar .env

Abra o arquivo `.env` e substitua `[YOUR_PASSWORD]`:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.ydxusofevdsbfjakwvvj.supabase.co:5432/postgres"
```

**Exemplo** (não use este):
```env
DATABASE_URL="postgresql://postgres:abc123xyz@db.ydxusofevdsbfjakwvvj.supabase.co:5432/postgres"
```

### 1.2 Rodar Migrations Localmente

No PowerShell, execute:

```powershell
# Verificar se DATABASE_URL está correto
$env:DATABASE_URL = "postgresql://postgres:SUA_SENHA@db.ydxusofevdsbfjakwvvj.supabase.co:5432/postgres"

# Rodar migrations
pnpm prisma migrate deploy

# Ou com push (se preferir)
pnpm prisma db push
```

Se funcionar, você verá mensagem de sucesso.

### 1.3 Testar Localmente

```powershell
# Rodar aplicação
pnpm dev

# Criar um evento
# - Acesse: http://localhost:8080
# - Vá para Eventos
# - Clique em "+ Novo Evento"
# - Preencha e salve

# Verificar se salvou
# - Volte para Eventos - deve aparecer na lista
```

## ✅ Passo 2: Configurar Netlify

### 2.1 Adicionar DATABASE_URL no Netlify

1. Acesse seu site no Netlify:
   ```
   netlify.com → Seu Site → Site Settings
   ```

2. Vá para **Build & Deploy** → **Environment**

3. Clique em **Add variable**

4. Preencha:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:SUA_SENHA@db.ydxusofevdsbfjakwvvj.supabase.co:5432/postgres`
   - (Substitua `SUA_SENHA` pela senha real)

5. Clique em **Save**

### 2.2 Fazer Deploy

Na raiz do projeto, execute:

```powershell
# Adicionar alterações
git add .

# Fazer commit
git commit -m "config: adicionar variáveis Supabase para Netlify"

# Push para main
git push -f origin main
```

Netlify fará redeploy automaticamente.

### 2.3 Aguarde o Build

- No Netlify, vá para **Deploys**
- Aguarde o status ficar **Published** (verde)
- Isso leva 2-5 minutos

### 2.4 Testar em Produção

1. Acesse: `https://seu-site.netlify.app`
2. Crie um evento
3. Volte para Eventos - deve aparecer!

## 🆘 Troubleshooting

### Erro: "Can't reach database"

```
error P1001: Can't reach database server at db.yeregbewdvufdlvjpsiu...
```

**Causa**: Senha incorreta ou DATABASE_URL mal formatada

**Solução**:
```powershell
# Teste a connection localmente
psql "postgresql://postgres:SUA_SENHA@db.ydxusofevdsbfjakwvvj.supabase.co:5432/postgres"
```

Se conectar, a senha está correta.

### Erro: "FATAL: password authentication failed"

**Causa**: Senha errada

**Solução**: Resetar senha no Supabase:
1. Supabase Dashboard → Project Settings → Database
2. Clique em **Reset password**
3. Use a nova senha

### Erro no Netlify: "Build failed"

**Causa**: DATABASE_URL não configurada no Netlify

**Solução**:
1. Verifique se adicionou a variável em **Site Settings** → **Environment**
2. Aguarde o redeploy automático (ou clique **Redeploy**)

### Funciona local mas não em produção

**Causa**: Migrations não rodaram no Supabase

**Solução**:
```powershell
# Conecte à sua DATABASE_URL do Supabase
$env:DATABASE_URL = "postgresql://postgres:SUA_SENHA@db.ydxusofevdsbfjakwvvj.supabase.co:5432/postgres"

# Rode migrations
pnpm prisma migrate deploy
```

## ✨ Verificar Se Funcionou

### Localmente

```bash
# Acessar Prisma Studio
pnpm prisma studio

# Isso abre http://localhost:5555 com interface gráfica
# Você pode ver as tabelas criadas
```

### Em Produção

1. Acesse seu site
2. Crie um evento
3. Vá para **Supabase Dashboard** → **SQL Editor**
4. Execute:

```sql
SELECT * FROM "Evento";
```

Se aparecer seu evento, funcionou! ✅

## 📝 Informações do Supabase

| Item | Valor |
|------|-------|
| **Project ID** | ydxusofevdsbfjakwvvj |
| **Region** | South America (São Paulo) |
| **Database Host** | db.ydxusofevdsbfjakwvvj.supabase.co |
| **Database Port** | 5432 |
| **Database Name** | postgres |
| **User** | postgres |

## ✅ Checklist

- [ ] Copiei a senha do Supabase
- [ ] Atualizei `.env` com a senha correta
- [ ] Rodei `pnpm prisma migrate deploy` localmente
- [ ] Testei criar um evento localmente
- [ ] Adicionei `DATABASE_URL` no Netlify
- [ ] Fiz push com `git push -f origin main`
- [ ] Aguardei o Netlify terminar o build
- [ ] Testei criar evento em produção
- [ ] Evento foi salvo com sucesso ✅

**Pronto! Seu banco agora está conectado e eventos serão salvos!** 🎉
