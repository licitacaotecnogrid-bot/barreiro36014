# ✅ Checklist de Setup - Cloudflare + Supabase

## Sua configuração atual

- ✅ **Frontend**: React + Vite (será deployado no Cloudflare Pages)
- ✅ **Backend**: Express + Cloudflare Workers
- ✅ **Database**: Supabase PostgreSQL
- ✅ **Build**: Configurado com `npm run build:cloudflare`

## Próximos passos

### 1. ⚠️ **IMPORTANTE**: Configurar a senha do Supabase

Você forneceu: `postgresql://postgres:[YOUR_PASSWORD]@db.yeregbewdvufdlvjpsiu.supabase.co:5432/postgres`

Substitua `[YOUR_PASSWORD]` pela senha real do seu Supabase:

```bash
# No seu terminal local
export DATABASE_URL="postgresql://postgres:SENHA_REAL@db.yeregbewdvufdlvjpsiu.supabase.co:5432/postgres"
```

Ou atualize no seu `.env`:
```
DATABASE_URL=postgresql://postgres:SENHA_REAL@db.yeregbewdvufdlvjpsiu.supabase.co:5432/postgres
```

### 2. Instalar Cloudflare CLI

```bash
npm install -g wrangler
```

### 3. Autenticar no Cloudflare

```bash
wrangler login
```

### 4. Configurar Secrets do Cloudflare Workers

```bash
# Database
wrangler secret put DATABASE_URL
# Cole: postgresql://postgres:SENHA@db.yeregbewdvufdlvjpsiu.supabase.co:5432/postgres

# Supabase Keys
wrangler secret put SUPABASE_ANON_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcmVnYmV3ZHZ1ZmRsdmpwc2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNjExMjUsImV4cCI6MjA3OTgzNzEyNX0.MAvYzpDk83F_ZN2TxLyCERhJc55Bktwq31r4OLTGYM4

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcmVnYmV3ZHZ1ZmRsdmpwc2l1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDI2MTEyNSwiZXhwIjoyMDc5ODM3MTI1fQ.rkgAl8KJ96D91llkDR_jLJCZDYk7_hYH_dUSqRVxLxg
```

### 5. Build e Deploy do Frontend

**Opção A: Via GitHub (Recomendado)**

1. Faça commit e push do seu código para o GitHub
2. No Cloudflare Dashboard:
   - Vá para **Pages**
   - Click **Create a project** → **Connect to Git**
   - Selecione o repositório `licitacaotecnogrid-bot/barreiro3607`
   - **Build command**: `npm run build:client`
   - **Build output directory**: `dist/spa`
   - Click **Save and Deploy**

**Opção B: Via CLI**

```bash
# Build do frontend
npm run build:client

# Deploy do frontend
wrangler pages deploy dist/spa --project-name barreiro360
```

### 6. Build e Deploy do Backend

```bash
# Build da aplicação inteira (frontend + backend)
npm run build:cloudflare

# Deploy do Worker (backend)
wrangler deploy --env production
```

### 7. Configurar o domínio (opcional)

Se você tem um domínio próprio:

1. No Cloudflare Dashboard, vá para seu domínio
2. Vá para **Pages** e conecte seu projeto
3. Configure:
   - **Pages route**: `example.com/*`
   - **Workers route**: `example.com/api/*`

## Verificar o Deployment

Depois de fazer deploy:

```bash
# Ver logs do Worker
wrangler tail

# Testar o endpoint de ping
curl https://barreiro360.workers.dev/api/ping

# Testar o frontend
# Visite https://barreiro360.pages.dev
```

## Estrutura gerada

```
dist/
├── spa/                              # Frontend (Cloudflare Pages)
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
└── server/
    └── cloudflare-worker.mjs         # Backend (Cloudflare Workers)
```

## Notas Importantes

- 🔒 **Secrets**: Nunca commite secrets no GitHub. Use `wrangler secret` para configurar
- 📦 **Prisma**: O schema.prisma está configurado para PostgreSQL (Supabase)
- 🌍 **CORS**: Atualize as URLs permitidas no Supabase para seus domínios Cloudflare
- 🐞 **Debug**: Use `wrangler tail` para ver logs em tempo real

## Documentação

- [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) - Guia completo de deployment
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
