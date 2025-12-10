# Deployment no Cloudflare

Este guia explica como fazer deploy da aplicação Barreiro 360 no Cloudflare Pages (frontend) e Cloudflare Workers (backend).

## Pré-requisitos

1. **Conta Cloudflare** - Acesse https://dash.cloudflare.com
2. **Cloudflare CLI (Wrangler)** - Instale com:
   ```bash
   npm install -g wrangler
   ```
3. **Credenciais Supabase** - Já configuradas no arquivo `.env`
4. **Repositório GitHub** - Seu código deve estar no GitHub

## Estrutura de Deployment

```
barreiro360
├── Frontend: Cloudflare Pages (dist/spa)
└── Backend: Cloudflare Workers (dist/server/cloudflare-worker.mjs)
└── Database: Supabase PostgreSQL
```

## Passo 1: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no Cloudflare Workers:

```bash
wrangler secret put DATABASE_URL
# Cole: postgresql://postgres:SENHA@db.yeregbewdvufdlvjpsiu.supabase.co:5432/postgres

wrangler secret put SUPABASE_ANON_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Passo 2: Build Local

```bash
npm run build:cloudflare
```

Isto irá:
1. Compilar o frontend React (dist/spa)
2. Compilar o servidor Express para Cloudflare Workers (dist/server/cloudflare-worker.mjs)

## Passo 3: Deploy do Frontend (Cloudflare Pages)

### Opção A: Via Git (Recomendado)

1. Faça push do seu código para GitHub
2. No Cloudflare Dashboard:
   - Vá para **Pages**
   - Clique **Create a project**
   - Selecione **Connect to Git**
   - Autorize GitHub e selecione seu repositório
   - Configure:
     - **Production branch**: `main`
     - **Build command**: `npm run build:client`
     - **Build output directory**: `dist/spa`
   - Clique **Save and Deploy**

### Opção B: Via Wrangler (CLI)

**IMPORTANTE**: Use o arquivo de configuração separado para Pages:

```bash
# Fazer login
wrangler login

# Build do frontend
npm run build:client

# Deploy do frontend (sem usar wrangler.toml, que é para Workers)
wrangler pages deploy dist/spa --project-name barreiro360
```

Se preferir usar a configuração do arquivo, crie um novo projeto Pages via Dashboard.

## Passo 4: Deploy do Backend (Cloudflare Workers)

```bash
# Fazer login (se não fez no passo anterior)
wrangler login

# Deploy
wrangler deploy
```

## Passo 5: Configurar Roteamento

No seu domínio Cloudflare, configure as rotas:

**Para Cloudflare Pages (Frontend):**
- Route: `example.com/*`
- Action: Serve from Cloudflare Pages

**Para Cloudflare Workers (Backend):**
- Route: `example.com/api/*`
- Action: Serve from Cloudflare Workers

### Via wrangler.toml

O arquivo `wrangler.toml` já contém as configurações básicas. Ajuste:

```toml
[[routes]]
pattern = "https://barreiro360.pages.dev/*"

[[routes]]
pattern = "https://barreiro360.workers.dev/api/*"
```

## Passo 6: Configurar Supabase

Adicione as URLs de acesso na configuração CORS do Supabase:

1. Vá para **Authentication** > **Providers** > **Settings**
2. Adicione na lista de allowed URLs:
   ```
   https://barreiro360.pages.dev
   https://barreiro360.workers.dev
   https://seu-dominio.com
   ```

## Variáveis de Ambiente

### No Cloudflare Workers (Backend)

Defina via CLI:
```bash
wrangler secret put DATABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Ou via `wrangler.toml`:
```toml
[env.production]
vars = { 
  ENVIRONMENT = "production",
  SUPABASE_URL = "https://yeregbewdvufdlvjpsiu.supabase.co"
}
```

### No Cloudflare Pages (Frontend)

Configure as variáveis no Dashboard de Pages:
- **Settings** > **Environment variables**
- Adicione: `VITE_API_URL = https://barreiro360.workers.dev/api`

## Troubleshooting

### Erro: "DATABASE_URL not defined"
- Execute: `wrangler secret put DATABASE_URL`
- Copie a URL completa do Supabase

### Erro: "CORS policy"
- Configure as URLs permitidas no Supabase
- Verifique headers no Cloudflare Workers

### Erro: "Module not found"
- Execute: `npm install`
- Execute: `npm run build:cloudflare`
- Verifique se `dist/server/cloudflare-worker.mjs` foi gerado

## Monitoramento

### Logs do Cloudflare Workers
```bash
wrangler tail
```

### Analytics
- Dashboard Cloudflare > **Analytics Engine**

## Documentação Oficial

- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
