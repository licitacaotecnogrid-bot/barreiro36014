# 📊 Banco de Dados Offline

Este projeto usa um banco de dados **SQLite local** que funciona completamente offline. Você pode usar e mexer no banco sem internet!

## 📁 Estrutura

```
database/
├── init.sql          # Schema do banco SQLite
├── seed.ts           # Script para popular dados iniciais
├── cli.ts            # Ferramenta CLI para gerenciar dados
├── data/             # Pasta onde os dados JSON são armazenados
│   ├── professores.json
│   ├── projetosPesquisa.json
│   ├── projetosExtensao.json
│   └── materias.json
└── export/           # Pasta com backups exportados
```

## 🚀 Como Usar

### 1. **Listar Dados**

```bash
npm run db:list professores
npm run db:list projetosPesquisa
npm run db:list projetosExtensao
npm run db:list materias
```

### 2. **Adicionar um Professor**

```bash
npm run db:add professores '{"nome":"Prof. João Silva","email":"joao@pucminas.br","senha":"senha123","curso":"Análise e Desenvolvimento de Sistemas"}'
```

### 3. **Adicionar um Projeto de Pesquisa**

```bash
npm run db:add projetosPesquisa '{"titulo":"Meu Projeto","areaTemática":"IA","descricao":"Desc","momentoOcorre":"2025-05-01","problemaPesquisa":"Problema?","metodologia":"Metodo","resultadosEsperados":"Resultados","professorCoordenadorId":1}'
```

### 4. **Adicionar um Projeto de Extensão**

```bash
npm run db:add projetosExtensao '{"titulo":"Workshop","areaTemática":"Web","descricao":"Desc","momentoOcorre":"2025-05-01","tipoPessoasProcuram":"Iniciantes","comunidadeEnvolvida":"Comunidade Local","professorCoordenadorId":1}'
```

### 5. **Atualizar um Item**

```bash
npm run db:update professores 1 '{"nome":"Prof. João Atualizado"}'
```

### 6. **Deletar um Item**

```bash
npm run db:delete professores 1
```

### 7. **Exportar Banco Inteiro**

```bash
npm run db:export all
```

## 🗄️ Estrutura de Dados

### Professor Coordenador
```json
{
  "id": 1,
  "nome": "Prof. Ana Silva",
  "email": "ana.silva@pucminas.br",
  "senha": "senha123",
  "curso": "Análise e Desenvolvimento de Sistemas"
}
```

### Projeto de Pesquisa
```json
{
  "id": 1,
  "titulo": "Análise de Segurança",
  "areaTemática": "Segurança da Informação",
  "descricao": "Pesquisa sobre...",
  "momentoOcorre": "2025-03-15",
  "problemaPesquisa": "Qual é o problema?",
  "metodologia": "Como vamos fazer...",
  "resultadosEsperados": "Esperamos obter...",
  "imagem": null,
  "professorCoordenadorId": 1
}
```

### Projeto de Extensão
```json
{
  "id": 1,
  "titulo": "Workshop Mobile",
  "areaTemática": "Desenvolvimento Mobile",
  "descricao": "Workshop prático...",
  "momentoOcorre": "2025-03-15",
  "tipoPessoasProcuram": "Iniciantes em programação",
  "comunidadeEnvolvida": "Comunidade de tecnologia",
  "imagem": null,
  "professorCoordenadorId": 1
}
```

### Matéria
```json
{
  "id": 1,
  "nome": "Análise e Desenvolvimento de Sistemas",
  "descricao": "Programa de análise e desenvolvimento..."
}
```

## 💾 Como o Banco Funciona

1. **Armazenamento Local**: Os dados são salvos em arquivos JSON na pasta `database/data/`
2. **Sem Dependências Externas**: Não precisa de servidor ou internet
3. **Sincronização com API**: O backend (Node.js) pode ler/escrever esses dados
4. **Backup Automático**: Use `npm run db:export` para fazer backup

## 🔄 Inicializar Banco com Dados de Exemplo

```bash
npm run db:seed
```

Este comando vai criar dados de exemplo iniciais.

## 📲 Usar pelo Frontend

Os dados do banco são acessados pela API em `http://localhost:3000/api/`:

- `GET /api/professores` - Listar professores
- `POST /api/professores` - Criar professor
- `GET /api/projetos-pesquisa` - Listar projetos
- `POST /api/projetos-pesquisa` - Criar projeto
- ... e outros endpoints

## ⚙️ Configurações

### package.json scripts

Adicione estes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "db:list": "ts-node database/cli.ts list",
    "db:add": "ts-node database/cli.ts add",
    "db:delete": "ts-node database/cli.ts delete",
    "db:update": "ts-node database/cli.ts update",
    "db:clear": "ts-node database/cli.ts clear",
    "db:export": "ts-node database/cli.ts export",
    "db:seed": "ts-node database/seed.ts"
  }
}
```

## 🎯 Dicas

✅ **Editar manualmente**: Você pode abrir `database/data/professores.json` no seu editor e editar direto  
✅ **Backup**: Sempre faça `npm run db:export` antes de deletar muita coisa  
✅ **Offline**: O banco funciona totalmente offline, sem precisar de internet  
✅ **Sincronização**: O frontend lê do API, que lê do banco local

## 🐛 Problemas Comuns

**"Comando não encontrado"**: Certifique-se de ter `ts-node` instalado  
**"Arquivo não existe"**: Crie manualmente a pasta `database/data/` se necessário  
**"JSON inválido"**: Verifique as aspas e a formatação do JSON

Tudo pronto! Agora você tem um banco de dados offline, simples de mexer! 🎉
