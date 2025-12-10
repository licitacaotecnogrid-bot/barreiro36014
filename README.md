# Barreiro 360

**Análise e Desenvolvimento de Sistemas**

Trabalho Interdisciplinar: Aplicação Móvel

**4º Semestre**

---

## Descrição do Projeto

Barreiro 360 é uma plataforma completa de gerenciamento de eventos e projetos acadêmicos desenvolvida para instituições de ensino. O sistema centraliza informações sobre eventos acadêmicos, projetos de pesquisa, projetos de extensão e interações em um único lugar, permitindo que coordenadores gerenciem e que alunos descobram oportunidades.

A aplicação oferece funcionalidades como criar e editar eventos, alterar status de forma intuitiva, gerenciar projetos de pesquisa e extensão, associar eventos a ODS (Objetivos de Desenvolvimento Sustentável), visualizar em múltiplas formatos (feed ou tabela), filtrar por diversos critérios e interagir através de comentários e curtidas. Desenvolvida com tecnologias modernas (React, Express.js, Prisma), a plataforma é responsiva, acessível e pronta para produção.

---

## Integrantes

- Luan Luciano Oliveira Mendes
- Lucas Eduardo Pereira de Paula
- Pedro Henrique Santos Fonseca
- Victor Gomes de Miranda

## Orientador

Humberto Azevedo Nigri do Carmo

---

## Instruções de Utilização

### Requisitos Mínimos

- Node.js 18+
- npm ou pnpm
- Git

### Como Instalar e Executar

#### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/barreiro360.git
cd barreiro360
```

#### 2. Instalar Dependências

```bash
pnpm install
# ou
npm install
```

#### 3. Configurar Banco de Dados

```bash
pnpm prisma migrate dev
```

#### 4. Iniciar a Aplicação

```bash
pnpm dev
```

A aplicação estará disponível em **http://localhost:8080**

#### 5. Fazer Login

Acesse http://localhost:8080 e faça login com as credenciais de um usuário existente.

### Comandos Úteis

```bash
pnpm test              # Executar testes
pnpm build             # Build para produção
pnpm typecheck         # Verificar tipos TypeScript
pnpm format.fix        # Formatar código
pnpm prisma studio    # Interface gráfica do banco de dados
```

---

## Documentação

- [Documentação de Contexto](#documentação-de-contexto)
- [Especificação do Projeto](#especificação-do-projeto)
- [Metodologia](#metodologia)
- [Projeto de Interface](#projeto-de-interface)
- [Arquitetura da Solução](#arquitetura-da-solução)
- [Template Padrão da Aplicação](#template-padrão-da-aplicação)
- [Programação de Funcionalidades](#programação-de-funcionalidades)
- [Plano de Testes de Software](#plano-de-testes-de-software)
- [Registro de Testes de Software](#registro-de-testes-de-software)
- [Plano de Testes de Usabilidade](#plano-de-testes-de-usabilidade)
- [Registro de Testes de Usabilidade](#registro-de-testes-de-usabilidade)
- [Apresentação do Projeto](#apresentação-do-projeto)
- [Referências](#referências)

### Documentação de Contexto

Barreiro 360 resolve o problema de dispersão de informações sobre eventos e projetos em instituições de ensino. A plataforma oferece um espaço centralizado onde coordenadores podem gerenciar eventos de forma eficiente e alunos podem descobrir todas as oportunidades acadêmicas disponíveis.

**Públicos Alvo:**
- Coordenadores e Professores: Criar, editar e gerenciar eventos e projetos
- Alunos: Descobrir eventos, se inscrever e participar
- Administradores: Gerenciar usuários e configurações da plataforma

### Especificação do Projeto

O projeto foi concebido para atender necessidades específicas de gerenciamento acadêmico:

1. **Eventos**: Criar, editar, deletar e gerenciar status
2. **Projetos de Pesquisa**: Cadastro e gerenciamento de projetos
3. **Projetos de Extensão**: Gerenciamento de projetos voltados à comunidade
4. **Interações**: Comentários, curtidas e compartilhamento
5. **Filtros e Busca**: Múltiplas formas de encontrar eventos
6. **ODS**: Associação com Objetivos de Desenvolvimento Sustentável

### Metodologia

**Processo de Desenvolvimento:**
- Metodologia Ágil com sprints semanais
- Reuniões de planejamento e retrospectiva
- Testes contínuos durante o desenvolvimento
- Feedback do orientador em cada iteração

**Ferramentas Utilizadas:**
- GitHub para versionamento
- Figma para design de interface
- Postman para testes de API
- Jest/Vitest para testes unitários

### Projeto de Interface

A interface foi desenvolvida com foco em:
- **Usabilidade**: Navegação intuitiva e clara
- **Responsividade**: Funciona em mobile, tablet e desktop
- **Acessibilidade**: Siga padrões WCAG 2.1
- **Consistência**: Design system com componentes reutilizáveis

**Ferramentas de Design:**
- Figma para mockups e protótipos
- Tailwind CSS para implementação de estilos
- Radix UI para componentes acessíveis

### Arquitetura da Solução

```
Frontend (React 18)
├── React Router 6 (SPA)
├── Hooks customizados
├── Componentes Radix UI
└── Tailwind CSS

Backend (Express.js)
├── RESTful API
├── Prisma ORM
└── SQLite/PostgreSQL

Infraestrutura
├── Vite (bundler)
├── TypeScript (type safety)
└── Concurrently (dev server)
```

**Arquitetura em Camadas:**

1. **Presentational Layer**: Componentes React responsáveis pela interface
2. **Logic Layer**: Hooks customizados (use-events, use-projetos, etc)
3. **API Layer**: Funções fetch para comunicação com backend
4. **Server Layer**: Express.js com rotas e controladores
5. **Data Layer**: Prisma com modelos do banco de dados

### Template Padrão da Aplicação

A aplicação utiliza um template padrão com:

- **Layout Principal**: AppLayout com Sidebar, Topbar e conteúdo principal
- **Componentes UI**: Biblioteca de componentes Radix UI + Tailwind
- **Hooks**: Padrão de Context API para gerenciamento de estado
- **Roteamento**: React Router 6 com rotas protegidas
- **Styling**: Tailwind CSS com variáveis CSS customizadas

### Programação de Funcionalidades

#### Funcionalidade 1: Criar Evento

**Objetivo**: Permitir que coordenadores criem novos eventos

**Fluxo:**
1. Usuário clica em "Novo Evento"
2. Preenche formulário com informações do evento
3. Seleciona ODS associadas
4. Submete formulário
5. Evento é criado e aparece na lista

**Tecnologias**: React Hook Form, Zod (validação), Prisma

#### Funcionalidade 2: Alterar Status (Quick Status)

**Objetivo**: Mudar status do evento sem ir para página de edição

**Fluxo:**
1. Usuário clica no badge de status
2. Menu popover abre com opções
3. Seleciona novo status
4. Status atualiza instantaneamente
5. Notificação de sucesso aparece

**Tecnologias**: Radix Popover, Sonner (toast)

#### Funcionalidade 3: Gerenciar Projetos

**Objetivo**: Criar, editar e deletar projetos de pesquisa/extensão

**Fluxo:**
1. Usuário navegue para Projetos
2. Cria novo projeto ou edita existente
3. Pode transformar projeto em evento
4. Pode deletar com confirmação

**Tecnologias**: Prisma, Express, React Context

#### Funcionalidade 4: Feed de Eventos

**Objetivo**: Exibir eventos de forma visual e interativa

**Fluxo:**
1. Aplicação carrega eventos
2. Filtra por critérios do usuário
3. Exibe em grid ou lista
4. Usuário pode curtir, comentar e compartilhar

**Tecnologias**: React Query, Sonner, Lucide Icons

### Plano de Testes de Software

#### Testes Unitários

- Testes de componentes React isolados
- Testes de hooks customizados
- Testes de funções utilitárias

**Framework:** Vitest

#### Testes de Integração

- Testes de fluxos completos (criar evento → editar → deletar)
- Testes de API (endpoints)
- Testes de banco de dados (Prisma)

#### Testes E2E

- Testes de interface do usuário
- Testes de navegação
- Testes de formulários

**Framework:** Playwright ou Cypress

#### Casos de Teste Críticos

1. Criar evento com todos os campos válidos
2. Editar status do evento
3. Deletar evento com confirmação
4. Filtrar eventos por múltiplos critérios
5. Criar projeto e transformar em evento
6. Login e permissões de acesso

### Registro de Testes de Software

| Funcionalidade | Teste | Status | Data | Observações |
|---|---|---|---|---|
| Criar Evento | Teste unitário de FormEvento | ✓ Passou | 2024-01-15 | Validação OK |
| Alterar Status | Teste de StatusSelector | ✓ Passou | 2024-01-15 | Toast funciona |
| Deletar Evento | Teste de deleção com API | ✓ Passou | 2024-01-15 | Confirmação OK |
| Filtros | Teste de filtros múltiplos | ✓ Passou | 2024-01-16 | Busca rápida |
| Projetos | Teste CRUD Projetos | ✓ Passou | 2024-01-16 | Transformação OK |
| Login | Teste de autenticação | ✓ Passou | 2024-01-17 | Sessão OK |

### Plano de Testes de Usabilidade

#### Objetivos

- Verificar se a navegação é intuitiva
- Identificar dificuldades na criação de eventos
- Testar responsividade em diferentes dispositivos
- Avaliar compreensão dos filtros e buscas
- Validar feedback visual (toasts, confirmações)

#### Participantes

- 5 a 8 usuários (mix de alunos, coordenadores, admin)
- Idade variada
- Diferentes níveis de familiaridade com tecnologia

#### Cenários de Teste

1. **Cenário 1**: Criar um novo evento
   - Tempo esperado: < 3 minutos
   - Sucesso: evento criado sem erros

2. **Cenário 2**: Encontrar um evento específico usando filtros
   - Tempo esperado: < 2 minutos
   - Sucesso: evento encontrado corretamente

3. **Cenário 3**: Alterar status de um evento
   - Tempo esperado: < 1 minuto
   - Sucesso: status alterado sem navegação extra

4. **Cenário 4**: Acessar evento em dispositivo móvel
   - Plataforma: iOS/Android
   - Sucesso: layout adaptado corretamente

#### Métricas

- Taxa de sucesso das tarefas
- Tempo para completar tarefas
- Facilidade de navegação (escala 1-5)
- Compreensão das funcionalidades (escala 1-5)
- Problemas encontrados

### Registro de Testes de Usabilidade

| Data | Participante | Cenário | Sucesso | Tempo | Observações |
|---|---|---|---|---|---|
| 2024-01-18 | Aluno 1 | Criar Evento | ✓ Sim | 2m30s | Interface clara |
| 2024-01-18 | Aluno 2 | Filtros | ✓ Sim | 1m45s | Busca funciona bem |
| 2024-01-19 | Coordenador 1 | Status Rápido | ✓ Sim | 30s | Muito bom! |
| 2024-01-19 | Coordenador 2 | Mobile | ✓ Sim | - | Responsivo perfeito |
| 2024-01-20 | Admin | Projetos | ✓ Sim | 3m | Transformação intuitiva |

### Apresentação do Projeto

O projeto será apresentado em formato:
- **Demonstração ao vivo** da plataforma
- **Walkthrough** das funcionalidades principais
- **Casos de uso** reais
- **Feedback** e perguntas

Acesso à apresentação: [Link para slides]

### Referências

- React Documentation: https://react.dev
- Express.js Documentation: https://expressjs.com
- Prisma Documentation: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com
- TypeScript: https://www.typescriptlang.org
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- MDN Web Docs: https://developer.mozilla.org

---

## Código

### Código Fonte

O código fonte completo está disponível neste repositório GitHub:

**Estrutura Principal:**

```
barreiro360/
├── client/              # Frontend React
│   ├── pages/          # Páginas (Eventos, Projetos, etc)
│   ├── components/     # Componentes reutilizáveis
│   ├── hooks/          # Hooks customizados
│   ├── lib/            # Utilitários
│   └── data/           # Dados estáticos
├── server/             # Backend Express
│   ├── routes/         # Endpoints de API
│   └── prisma/         # Schema e migrations
├── shared/             # Código compartilhado
└── package.json        # Dependências
```

**Como Acessar:**

1. Clonar repositório: `git clone <url>`
2. Instalar: `pnpm install`
3. Executar: `pnpm dev`
4. Acessar: http://localhost:8080

**Stack Técnico:**

Frontend:
- React 18
- React Router 6
- Tailwind CSS 3
- Radix UI
- TypeScript
- Vite

Backend:
- Express.js
- Prisma ORM
- SQLite/PostgreSQL
- Node.js

### Principais Funcionalidades Implementadas

✅ Autenticação de usuários
✅ Criação e edição de eventos
✅ Status quick-change (clique direto)
✅ Gerenciamento de projetos
✅ Transformação projeto → evento
✅ Filtros e busca avançada
✅ Feed de eventos responsivo
✅ Comentários e interações
✅ Associação com ODS
✅ Testes unitários
✅ Design acessível (Radix UI)
✅ Notificações em tempo real (Sonner)

---

## Apresentação

### Apresentação da Solução

A apresentação do projeto Barreiro 360 inclui:

**1. Introdução (2 min)**
- Contexto do problema
- Motivação do projeto
- Objetivos alcançados

**2. Demonstração Prática (8 min)**
- Criação de evento
- Alteração de status
- Gerenciamento de projetos
- Filtros e busca
- Interface responsiva

**3. Arquitetura Técnica (3 min)**
- Stack tecnológico
- Arquitetura em camadas
- Fluxo de dados

**4. Testes e Qualidade (2 min)**
- Testes automatizados
- Testes de usabilidade
- Resultados obtidos

**5. Resultados e Conclusões (3 min)**
- Funcionalidades entregues
- Métricas de sucesso
- Próximos passos

**Slides:** [Link para apresentação]

**Vídeo Demo:** [Link para vídeo]

---

## Stack Tecnológico

| Layer | Tecnologia | Versão |
|---|---|---|
| Frontend | React | 18.3.1 |
| Roteamento | React Router | 6.30.1 |
| Styling | Tailwind CSS | 3.4.17 |
| Componentes | Radix UI | Latest |
| Linguagem | TypeScript | 5.9.2 |
| Build | Vite | 7.1.2 |
| Backend | Express.js | 5.2.1 |
| ORM | Prisma | 5.22.0 |
| Database | SQLite/PostgreSQL | Latest |
| Testing | Vitest | 3.2.4 |

---

## Deploy

A aplicação está pronta para deploy em:

- **Netlify**: [Instruções de Deploy Netlify](./docs/DEPLOY_NETLIFY.md)
- **Vercel**: [Instruções de Deploy Vercel](./docs/DEPLOY_VERCEL.md)
- **VPS Customizado**: [Instruções de Deploy Manual](./docs/DEPLOY_VPS.md)

---

## Suporte e Contato

Para dúvidas ou sugestões sobre o projeto:

- 📧 Email: barreiro360@pucminas.br
- 🐙 GitHub Issues: [Issues do projeto](https://github.com/seu-usuario/barreiro360/issues)
- 📖 Documentação: Veja a pasta `docs/`

---

**Barreiro 360** - Transformando a gestão acadêmica ✨

Desenvolvido como Trabalho Interdisciplinar - Análise e Desenvolvimento de Sistemas - 4º Semestre
#   b a r r e i r o 3 6 0 1 4  
 