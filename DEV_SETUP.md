# Development Setup - Cloudflare Workers + D1

This guide explains how to run the development environment locally with Cloudflare Workers and D1 database.

## Prerequisites

1. **Node.js** (v18+)
2. **npm** or **pnpm**
3. **Wrangler CLI** (Cloudflare Workers CLI)

### Install Wrangler

```bash
npm install -g wrangler
```

### Verify installation

```bash
wrangler --version
```

## Running Development Locally

Your project uses:
- **Frontend**: React + Vite on port `8080`
- **Backend**: Cloudflare Workers on port `8081`
- **Database**: D1 (SQLite via Cloudflare)

### Step 1: Start the Cloudflare Worker Backend

Open **Terminal 1** and run:

```bash
npm run dev:backend
```

This command:
- Builds the backend code (if needed)
- Starts the Cloudflare Worker locally on port `8081`
- Connects to the D1 database

⏳ Wait for the output to show "Ready on http://localhost:8081"

### Step 2: Start the Frontend Dev Server

Open **Terminal 2** and run:

```bash
npm run dev
```

This command:
- Starts Vite dev server on port `8080`
- Sets up a proxy that forwards `/api/*` requests to `http://localhost:8081`

✅ Once both servers are running, navigate to: **http://localhost:8080**

## Troubleshooting

### Issue: Backend won't start with "wrangler: command not found"

**Solution**: Install wrangler globally
```bash
npm install -g wrangler
```

### Issue: Port 8081 already in use

**Solution**: Kill the process using port 8081
```bash
# macOS/Linux
lsof -ti:8081 | xargs kill -9

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Issue: API calls return "ECONNREFUSED 127.0.0.1:8081"

**Cause**: Backend server is not running  
**Solution**: Make sure you've run `npm run dev:backend` in a separate terminal

### Issue: Database errors (e.g., "table not found")

**Cause**: D1 database schema hasn't been migrated  
**Solution**: The schema should be automatically created. If not, check that your D1 database is properly linked in `wrangler.toml`

## Database Management

### View D1 Database Schema

The schema is defined in `wrangler-d1-schema.sql`. It includes:
- `usuario` - Users/accounts
- `evento` - Events
- `professor_coordenador` - Professors
- `projeto_pesquisa` - Research projects
- `projeto_extensao` - Extension projects
- And supporting tables for relationships

### Creating/Modifying Database

For local development, D1 automatically syncs with your remote database setup. Changes made during development are local to your machine.

## Environment Variables

### Frontend

Environment variables should be in `.env` or `.env.local`:
```
VITE_API_URL=        # Leave empty for local dev (uses /api proxy)
```

### Backend

The backend reads from `wrangler.toml`:
- D1 binding is configured as `DB`
- Database ID is linked to your Cloudflare account

## Common Tasks

### Create a new event

1. Go to http://localhost:8080
2. Navigate to "Eventos" → "Novo Evento"
3. Fill in the form
4. Click "Salvar"
5. Event should be created in D1 database

### View database contents

With the backend running, use the Cloudflare dashboard or query tools to inspect the D1 database directly.

### Restart both servers

Just press `Ctrl+C` in both terminals and run the commands again.

## Building for Production

```bash
# Build client and server
npm run build:cloudflare

# Deploy to Cloudflare
wrangler deploy --env production
```

## Architecture

```
Request Flow:
┌─────────────────────┐
│   Browser          │
│  (port 8080)       │
└──────────┬──────────┘
           │ /api request
           ↓
┌─────────────────────┐
│  Vite Proxy        │
│  (port 8080)       │
└──────────┬──────────┘
           │ forwards to :8081
           ↓
┌─────────────────────┐
│  Cloudflare Worker │
│  (port 8081)       │
└──────────┬──────────┘
           │ queries
           ↓
┌─────────────────────┐
│  D1 Database       │
└─────────────────────┘
```

## Support

For more information:
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
