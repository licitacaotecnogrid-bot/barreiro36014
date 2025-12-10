# 🗄️ Banco de Dados Offline - Quick Start

Seu projeto agora tem um **banco de dados SQLite que funciona 100% offline**!

## ✨ Resumo Rápido

O banco usa arquivos **JSON** que você pode editar diretamente ou usar comandos CLI.

## 📂 Arquivos do Banco

```
database/data/
├── professores.json           ← Professores coordenadores
├── projetosPesquisa.json      ← Projetos de pesquisa
├── projetosExtensao.json      ← Projetos de extensão
└── materias.json              ← Matérias/cursos
```

## 🎯 Usar o Banco

### Opção 1: Editar Direto (mais fácil)

Abra `database/data/professores.json` e edite assim:

```json
[
  {
    "id": 1,
    "nome": "Prof. Ana Silva",
    "email": "ana.silva@pucminas.br",
    "senha": "senha123",
    "curso": "Análise e Desenvolvimento de Sistemas"
  }
]
```

Salve e o banco está atualizado! ✅

### Opção 2: Usar Comandos CLI

#### Listar professores:
```bash
npm run db:list professores
```

#### Adicionar professor:
```bash
npm run db:add professores '{"nome":"Prof. João","email":"joao@puc.br","senha":"123","curso":"ADS"}'
```

#### Deletar professor:
```bash
npm run db:delete professores 1
```

#### Atualizar professor:
```bash
npm run db:update professores 1 '{"nome":"Prof. João Silva"}'
```

#### Exportar tudo:
```bash
npm run db:export all
```

## 🏗️ Estruturas de Dados

### 1️⃣ Professor
```json
{
  "id": 1,
  "nome": "Prof. Ana Silva",
  "email": "ana.silva@pucminas.br",
  "senha": "senha123",
  "curso": "Análise e Desenvolvimento de Sistemas"
}
```

### 2️⃣ Projeto de Pesquisa
```json
{
  "id": 1,
  "titulo": "Análise de Segurança Web",
  "areaTemática": "Segurança da Informação",
  "descricao": "Pesquisa sobre...",
  "momentoOcorre": "2025-03-15",
  "problemaPesquisa": "Qual é o problema?",
  "metodologia": "Como fazer...",
  "resultadosEsperados": "Esperamos...",
  "imagem": null,
  "professorCoordenadorId": 1
}
```

### 3️⃣ Projeto de Extensão
```json
{
  "id": 1,
  "titulo": "Workshop Mobile",
  "areaTemática": "Desenvolvimento Mobile",
  "descricao": "Workshop prático...",
  "momentoOcorre": "2025-03-15",
  "tipoPessoasProcuram": "Iniciantes",
  "comunidadeEnvolvida": "Comunidade local",
  "imagem": null,
  "professorCoordenadorId": 1
}
```

### 4️⃣ Matéria
```json
{
  "id": 1,
  "nome": "Análise e Desenvolvimento de Sistemas",
  "descricao": "Programa de análise e desenvolvimento..."
}
```

## 🔗 Como o Banco se Conecta ao App

```
[Arquivo JSON]
    ↓
[Backend Node.js - /api/...]
    ↓
[Frontend React]
    ↓
[Tela do Usuário]
```

1. **Backend** lê os arquivos JSON em `database/data/`
2. **API** expõe os dados em endpoints como `/api/professores`
3. **Frontend** faz requisições à API
4. **Dados aparecem na tela**

## ⚡ Comandos Úteis

| Comando | O que faz |
|---------|-----------|
| `npm run db:list <tipo>` | Mostra todos os dados |
| `npm run db:add <tipo> '<json>'` | Adiciona novo item |
| `npm run db:update <tipo> <id> '<json>'` | Atualiza item |
| `npm run db:delete <tipo> <id>` | Deleta item |
| `npm run db:clear <tipo>` | Limpa tudo |
| `npm run db:export` | Faz backup em JSON |

## 💡 Exemplos Reais

### Adicionar um novo professor:
```bash
npm run db:add professores '{"nome":"Prof. Pedro Costa","email":"pedro@puc.br","senha":"senha456","curso":"ADS"}'
```

### Adicionar novo projeto de pesquisa:
```bash
npm run db:add projetosPesquisa '{"titulo":"IA Generativa","areaTemática":"Inteligência Artificial","descricao":"Estudo de IA generativa","momentoOcorre":"2025-06-01","problemaPesquisa":"Como usar IA?","metodologia":"Pesquisa teórica","resultadosEsperados":"Documentação","professorCoordenadorId":1}'
```

### Deletar professor 2:
```bash
npm run db:delete professores 2
```

### Fazer backup:
```bash
npm run db:export all
```

## 📖 Mais Informações

Para guia completo, veja [DATABASE.md](./DATABASE.md)

---

**Pronto! Seu banco offline está funcionando!** 🎉

Você pode:
- ✅ Editar dados direto nos arquivos JSON
- ✅ Usar comandos CLI para gerenciar dados
- ✅ Funciona 100% offline sem internet
- ✅ Backend sincroniza automaticamente
- ✅ Frontend vê as mudanças na tela
