# Migration from Prisma to Cloudflare D1

This document outlines the migration from Prisma ORM to Cloudflare D1 (SQLite) database.

## What Changed

### Removed Dependencies
- `@prisma/client` - Prisma client library
- `prisma` - Prisma CLI
- `better-sqlite3` - SQLite adapter (no longer needed)
- `express` - Express server (replaced with Hono)
- `ts-node` - TypeScript node runner

### Added/Used Dependencies
- `hono` - Lightweight web framework for Cloudflare Workers (already in package.json)

### Key Files Modified/Created

1. **package.json**
   - Removed Prisma and Express dependencies
   - Removed Prisma-related build scripts

2. **wrangler.toml**
   - Added D1 database bindings
   - Configure database IDs for different environments

3. **server/cloudflare-worker-server-d1.ts** (NEW)
   - Hono-based API server using D1 instead of Prisma
   - All endpoints migrated to use raw SQL queries via D1 API

4. **server/d1-db.ts** (NEW)
   - Database query utility wrapper for D1
   - Provides `run()`, `all()`, and `one()` methods similar to common DB patterns

5. **server/cloudflare-worker.ts**
   - Updated to import the new D1-based server

6. **wrangler-d1-schema.sql** (NEW)
   - Complete SQL schema for all database tables
   - Includes indexes for performance optimization
   - Uses snake_case for column names (D1 convention)

### Removed Files
- **server/prisma.ts** - No longer needed (Prisma client initialization)
- **prisma/schema.prisma** - Replaced with SQL schema
- **server/routes/** - Express route handlers (functionality moved to Hono app)
- **server/index.ts** - Express server setup (replaced with Hono)

## Migration Steps for Deployment

### 1. Create D1 Database
```bash
wrangler d1 create barreiro360-db
```

This will generate a database ID. Update `wrangler.toml` with the ID.

### 2. Initialize Database Schema
```bash
wrangler d1 execute barreiro360-db --file wrangler-d1-schema.sql
```

This creates all tables and indexes.

### 3. Deploy to Cloudflare
```bash
wrangler publish
```

### 4. Environment Configuration

In `wrangler.toml`, you need to set the database IDs:

**Development:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "barreiro360-db"
database_id = "YOUR_LOCAL_DATABASE_ID"
```

**Production:**
```toml
[env.production]
d1_databases = [
  { binding = "DB", database_name = "barreiro360-db-prod", database_id = "YOUR_PROD_DATABASE_ID" }
]
```

## API Endpoints

All endpoints remain the same, but now use Hono and D1 internally:

### Usuarios
- `POST /api/login` - User login
- `GET /api/usuarios` - List all users
- `POST /api/usuarios` - Create user
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user

### Eventos
- `GET /api/eventos` - List all events
- `GET /api/eventos/:id` - Get event by ID
- `POST /api/eventos` - Create event
- `PUT /api/eventos/:id` - Update event
- `DELETE /api/eventos/:id` - Delete event

### Comentários
- `GET /api/eventos/:eventoId/comentarios` - Get comments for event
- `POST /api/eventos/:eventoId/comentarios` - Add comment
- `PUT /api/eventos/:eventoId/comentarios/:comentarioId` - Update comment
- `DELETE /api/eventos/:eventoId/comentarios/:comentarioId` - Delete comment

### Professores
- `GET /api/professores` - List professors
- `POST /api/professores` - Create professor
- `GET /api/professores/:id` - Get professor
- `PUT /api/professores/:id` - Update professor
- `DELETE /api/professores/:id` - Delete professor

### Projetos Pesquisa
- `GET /api/projetos-pesquisa` - List research projects
- `POST /api/projetos-pesquisa` - Create research project
- `GET /api/projetos-pesquisa/:id` - Get research project
- `PUT /api/projetos-pesquisa/:id` - Update research project
- `DELETE /api/projetos-pesquisa/:id` - Delete research project

### Projetos Extensão
- `GET /api/projetos-extensao` - List extension projects
- `POST /api/projetos-extensao` - Create extension project
- `GET /api/projetos-extensao/:id` - Get extension project
- `PUT /api/projetos-extensao/:id` - Update extension project
- `DELETE /api/projetos-extensao/:id` - Delete extension project

### Materias
- `GET /api/materias` - List subjects
- `POST /api/materias` - Create subject
- `GET /api/materias/:id` - Get subject
- `PUT /api/materias/:id` - Update subject
- `DELETE /api/materias/:id` - Delete subject

## Database Schema Changes

### Table Name Changes (Prisma → D1)
Most tables follow snake_case convention in D1:

- `ProfessorCoordenador` → `professor_coordenador`
- `ProjetoPesquisa` → `projeto_pesquisa`
- `ProjetoExtensao` → `projeto_extensao`
- `MateriaProfessor` → `materia_professor`
- `MateriaProjetoPesquisa` → `materia_projeto_pesquisa`
- `MateriaProjetoExtensao` → `materia_projeto_extensao`
- `Usuario` → `usuario`
- `Evento` → `evento`
- `OdsEvento` → `ods_evento`
- `AnexoEvento` → `anexo_evento`
- `ComentarioEvento` → `comentario_evento`

### Column Name Changes
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`
- `areaTemática` → `area_tematica`
- `momentoOcorre` → `momento_ocorre`
- `problemaPesquisa` → `problema_pesquisa`
- `metodologia` → `metodologia`
- `resultadosEsperados` → `resultados_esperados`
- `professorCoordenadorId` → `professor_coordenador_id`
- `tipoPessoasProcuram` → `tipo_pessoas_procuram`
- `comunidadeEnvolvida` → `comunidade_envolvida`
- `tipoEvento` → `tipo_evento`
- `odsNumero` → `ods_numero`
- `eventoId` → `evento_id`
- `usuarioId` → `usuario_id`
- `criadoEm` → `criado_em`
- `atualizadoEm` → `atualizado_em`

## Testing Locally

To test locally with Wrangler:

```bash
wrangler dev
```

This will start a local development server with D1 bindings.

## Notes

1. **Date Handling**: D1 stores dates as ISO strings. Make sure your frontend handles date parsing correctly.

2. **Performance**: D1 is optimized for read-heavy workloads. Consider caching strategies for frequently accessed data.

3. **Backups**: Use Cloudflare's built-in backup mechanisms. Refer to Cloudflare documentation for details.

4. **Monitoring**: Use Cloudflare's analytics and logging features to monitor API performance.

## Troubleshooting

### Database ID Not Found
Make sure you've run `wrangler d1 create` and updated the database ID in `wrangler.toml`.

### Binding Not Found
Ensure `wrangler.toml` has the `[[d1_databases]]` section with the correct binding name "DB".

### Migration Failed
Check that the SQL schema is correct by running:
```bash
wrangler d1 execute barreiro360-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

## Future Improvements

1. Add database migration system for version control
2. Implement query logging for debugging
3. Add connection pooling (if needed)
4. Optimize queries with proper indexing
5. Add caching layer (Cloudflare KV) for frequently accessed data
