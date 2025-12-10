# 🗄️ Guia de Configuração SQLite + Prisma

Seu banco de dados agora usa **SQLite com Prisma ORM**! Aqui está como usar:

## 🚀 Primeiros Passos

### 1. Instalar dependências do Prisma

```bash
npm install @prisma/client
```

### 2. Executar as migrations

Para criar o banco de dados e as tabelas:

```bash
npm run prisma:push
```

ou para usar migrations com histórico:

```bash
npm run prisma:migrate
```

### 3. Popular o banco com dados iniciais

```bash
npm run prisma:seed
```

Isso vai:
- Criar 4 usuários de teste
- Criar 4 eventos de exemplo
- Associar ODS aos eventos

## 📊 Credenciais de Acesso

Após rodar o seed, use estes logins:

| Email | Senha | Cargo |
|-------|-------|-------|
| ana@pucminas.br | senha123 | Professora |
| carlos@pucminas.br | senha123 | Professor |
| julia@pucminas.br | senha123 | Coordenadora |
| joao.silva@pucminas.br | senha123 | Aluno |

## 🔧 Manipular o Banco

### Abrir Prisma Studio (Interface visual)

```bash
npm run prisma:studio
```

Isso abre uma interface web em http://localhost:5555 onde você pode:
- ✅ Ver todos os dados
- ✅ Criar novos registros
- ✅ Editar dados existentes
- ✅ Deletar registros
- ✅ Pesquisar

### Usar a API REST

#### Login
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@pucminas.br","senha":"senha123"}'
```

#### Listar Eventos
```bash
curl http://localhost:8080/api/eventos
```

#### Criar Evento
```bash
curl -X POST http://localhost:8080/api/eventos \
  -H "Content-Type: application/json" \
  -d '{
    "titulo":"Novo Evento",
    "data":"2025-05-10",
    "responsavel":"Prof. Ana",
    "status":"Confirmado",
    "local":"Auditório",
    "curso":"ADS",
    "tipoEvento":"Workshop",
    "descricao":"Descrição do evento",
    "odsAssociadas":[4,9,17]
  }'
```

#### Atualizar Evento
```bash
curl -X PUT http://localhost:8080/api/eventos/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Evento Atualizado"}'
```

#### Deletar Evento
```bash
curl -X DELETE http://localhost:8080/api/eventos/1
```

#### Listar Usuários
```bash
curl http://localhost:8080/api/usuarios
```

## 📁 Localização dos Arquivos

```
├── prisma/
│   ├── schema.prisma       # Definição do banco de dados
│   ├── seed.ts             # Script para popular dados
│   └── dev.db              # Arquivo SQLite (criado automaticamente)
├── server/
│   ├── prisma.ts           # Inicialização do Prisma Client
│   ├── routes/
│   │   ├── usuarios.ts      # Endpoints de usuários
│   │   └── eventos.ts       # Endpoints de eventos
│   └── index.ts            # Servidor principal
```

## 🛠️ Modificar o Schema

Se precisar adicionar campos ou tabelas:

1. Edite `prisma/schema.prisma`
2. Execute:
```bash
npm run prisma:migrate
```
3. Siga as instruções para criar a migration

## 🔄 Resetar o Banco

Para deletar tudo e começar novamente:

```bash
npm run prisma:push -- --force-reset
```

Depois repopule com:
```bash
npm run prisma:seed
```

## 📊 Estrutura do Banco

### Tabela: Usuario
- id (Int, PK)
- nome (String)
- email (String, UNIQUE)
- senha (String)
- cargo (String) - "Aluno", "Professor", "Coordenadora"
- criadoEm (DateTime)
- atualizadoEm (DateTime)

### Tabela: Evento
- id (Int, PK)
- titulo (String)
- data (DateTime)
- responsavel (String)
- status (String) - "Confirmado", "Pendente", "Cancelado"
- local (String)
- curso (String)
- tipoEvento (String)
- descricao (String, opcional)
- imagem (String, opcional)
- documento (String, opcional)
- link (String, opcional)
- criadoEm (DateTime)
- atualizadoEm (DateTime)

### Tabela: OdsEvento
- id (Int, PK)
- eventoId (Int, FK)
- odsNumero (Int) - 1 a 17
- criadoEm (DateTime)

### Tabela: AnexoEvento
- id (Int, PK)
- eventoId (Int, FK)
- nome (String)
- criadoEm (DateTime)

## ⚠️ Variáveis de Ambiente

Certifique-se que `.env` tem:
```
DATABASE_URL="file:./prisma/dev.db"
```

## 🆘 Troubleshooting

### Erro: "PrismaClientInitializationError"
- Rode: `npm install @prisma/client`
- Rode: `npm run prisma:push`

### Erro: "SQLITE_READONLY"
- Verifique permissões da pasta `prisma/`
- Rode: `chmod 755 prisma/`

### Banco vazio
- Execute: `npm run prisma:seed`

## 📚 Mais Informações

- Documentação Prisma: https://www.prisma.io/docs/
- SQLite: https://www.sqlite.org/
- Prisma Studio: https://www.prisma.io/docs/tools/prisma-studio
