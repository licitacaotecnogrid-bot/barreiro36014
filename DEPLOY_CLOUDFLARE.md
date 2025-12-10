# Deploy Completo no Cloudflare - Sem Ambiente Local

Este guia mostra como fazer deploy de tudo no Cloudflare (Pages + Workers + D1) sem rodar nada localmente.

## Configuração Realizada

✅ **Database D1**: `barreiro360-db` (ID: `281783e2-a986-4a7c-8fc3-b3628af37708`)
✅ **Worker Backend**: `barreiro360-api`
✅ **Pages Frontend**: `barreiro360`

## Como fazer Deploy

### Opção 1: Script Automático (Recomendado)

#### Windows (PowerShell)
```powershell
.\deploy.ps1
```

#### macOS/Linux (Bash)
```bash
chmod +x deploy.sh
./deploy.sh
```

O script faz tudo automaticamente:
1. ✅ Constrói o frontend (React)
2. ✅ Constrói o backend (Cloudflare Worker)
3. ✅ Faz deploy do Worker
4. ✅ Faz deploy do Pages
5. ✅ Mostra as URLs finais

**Tempo estimado**: 3-5 minutos

### Opção 2: Comandos Individuais

Se preferir controlar cada etapa:

```bash
# 1. Construir tudo
npm run build:cloudflare

# 2. Deploy do backend (Worker)
npm run deploy:worker

# 3. Deploy do frontend (Pages)
npm run deploy:pages
```

### Opção 3: Comando npm (Teste rápido)

Se o `npm run deploy` funcionar sem erros de configuração:

```bash
npm run deploy
```

Nota: Este comando pode falhar em algumas versões do Wrangler devido a conflitos de configuração. Use os scripts Bash/PowerShell para garantir sucesso.

## O que Acontece no Deploy

### Build
```
npm install    → Instala dependências
npm run build:cloudflare
  ├── build:client    → Cria dist/spa/ (frontend React)
  └── build server    → Cria dist/server/ (Cloudflare Worker)
```

### Deploy
```
wrangler deploy
  └── Envia dist/server/cloudflare-worker.mjs para Cloudflare Workers
      └── Conecta automaticamente ao banco D1 (barreiro360-db)

wrangler pages deploy dist/spa
  └── Envia dist/spa/ para Cloudflare Pages
      └── Frontend acessa API em https://barreiro360-api.workers.dev
```

## URLs Resultantes

Depois do deploy, você terá:

- **Frontend (Pages)**: https://barreiro360.pages.dev
- **Backend (Worker)**: https://barreiro360-api.workers.dev
- **API Endpoints**: https://barreiro360-api.workers.dev/api/*

O frontend automaticamente conecta ao backend pela variável `VITE_API_URL`.

## Primeiro Deploy - Autenticação

Na primeira vez, você pode ser solicitado a fazer login:

```bash
wrangler login
```

Isso abre uma janela do navegador para autenticar com sua conta Cloudflare.

## Verificar o Deployment

Após o deploy:

```bash
# Ver logs do Worker
wrangler tail

# Testar o backend
curl https://barreiro360-api.workers.dev/api/usuarios

# Acessar o frontend
# Visite: https://barreiro360.pages.dev
```

## Solução de Problemas

### Erro: "Configuration file cannot contain both 'main' and 'pages_build_output_dir'"

**Problema**: O `wrangler.toml` tem configurações tanto de Worker quanto de Pages.
**Solução**: Use o script `deploy.ps1` (Windows) ou `deploy.sh` (macOS/Linux) que renomeiam temporariamente o arquivo durante o deploy do Pages.

```powershell
# Windows
.\deploy.ps1

# macOS/Linux
./deploy.sh
```

### Erro: "It looks like you've run a Workers-specific command in a Pages project"

**Problema**: Tentou fazer deploy do Pages com `wrangler deploy` (comando de Worker).
**Solução**: Use `wrangler pages deploy` ou use um dos scripts automáticos.

### "Authentication failed" ou "Permission denied"

**Solução**: Faça login novamente
```bash
wrangler logout
wrangler login
```

### "Project not found"

**Solução**: O projeto Pages precisa existir. Crie assim:
```bash
# Primeira vez apenas
wrangler pages deploy dist/spa --project-name barreiro360
```

Depois use os scripts de deploy normalmente.

### Worker não conecta ao D1

**Verificação**: Confirme que o ID do banco está correto em `wrangler.toml`:
```toml
database_id = "281783e2-a986-4a7c-8fc3-b3628af37708"
```

### API retorna erro 500

Verifique os logs:
```bash
wrangler tail
```

Os logs mostram erros específicos do backend.

## Fluxo de Desenvolvimento

### Para trabalhar localmente:
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev
```

### Para deployar em produção:
```bash
npm run deploy
```

## Esquema de Arquitetura

```
┌─────────────────────────────────────────┐
│     Navegador do Usuário                │
│  (https://barreiro360.pages.dev)        │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│    Cloudflare Pages (Frontend)          │
│  • React + Vite                         │
│  • dist/spa/                            │
└──────────────────┬──────────────────────┘
                   │ Chamadas para /api/*
                   ↓
┌─────────────────────────────────────────┐
│   Cloudflare Workers (Backend)          │
│  • Hono.js + Node.js                    │
│  • dist/server/cloudflare-worker.mjs    │
└──────────────────┬──────────────────────┘
                   │ Queries SQL
                   ↓
┌─────────────────────────────────────────┐
│      Cloudflare D1 (Database)           │
│  • SQLite                               │
│  • barreiro360-db                       │
│  • Eventos, Professores, Projetos       │
└─────────────────────────────────────────┘
```

## Resumo de Comandos

| Comando | O que faz |
|---------|-----------|
| `npm install` | Instala dependências |
| `npm run dev` | Inicia frontend local (porta 8080) |
| `npm run dev:backend` | Inicia worker local (porta 8081) |
| `npm run build:cloudflare` | Constrói frontend + worker |
| `npm run deploy` | Deploy completo (recomendado) |
| `npm run deploy:worker` | Deploy apenas do worker |
| `npm run deploy:pages` | Deploy apenas do frontend |
| `wrangler tail` | Ver logs em tempo real |

## Próximos Passos

1. Execute: `npm run deploy`
2. Aguarde 2-3 minutos
3. Visite: https://barreiro360.pages.dev
4. Teste criar um evento - deve funcionar!

Tudo estará rodando 100% no Cloudflare! 🚀
