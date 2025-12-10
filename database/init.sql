-- Tabela de Professores Coordenadores
CREATE TABLE IF NOT EXISTS ProfessorCoordenador (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  curso TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Projetos de Pesquisa
CREATE TABLE IF NOT EXISTS ProjetoPesquisa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  areaTemática TEXT NOT NULL,
  descricao TEXT NOT NULL,
  momentoOcorre DATETIME NOT NULL,
  problemaPesquisa TEXT NOT NULL,
  metodologia TEXT NOT NULL,
  resultadosEsperados TEXT NOT NULL,
  imagem TEXT,
  professorCoordenadorId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professorCoordenadorId) REFERENCES ProfessorCoordenador(id) ON DELETE CASCADE
);

-- Tabela de Projetos de Extensão
CREATE TABLE IF NOT EXISTS ProjetoExtensao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  areaTemática TEXT NOT NULL,
  descricao TEXT NOT NULL,
  momentoOcorre DATETIME NOT NULL,
  tipoPessoasProcuram TEXT NOT NULL,
  comunidadeEnvolvida TEXT NOT NULL,
  imagem TEXT,
  professorCoordenadorId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professorCoordenadorId) REFERENCES ProfessorCoordenador(id) ON DELETE CASCADE
);

-- Tabela de Matérias
CREATE TABLE IF NOT EXISTS Materia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Associação Materia-Professor
CREATE TABLE IF NOT EXISTS MateriaProfessor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  professorId INTEGER NOT NULL,
  materiaId INTEGER NOT NULL,
  tipoCoordenacao TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(professorId, materiaId, tipoCoordenacao),
  FOREIGN KEY (professorId) REFERENCES ProfessorCoordenador(id) ON DELETE CASCADE,
  FOREIGN KEY (materiaId) REFERENCES Materia(id) ON DELETE CASCADE
);

-- Tabela de Associação Materia-ProjetoPesquisa
CREATE TABLE IF NOT EXISTS MateriaProjetoPesquisa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materiaId INTEGER NOT NULL,
  projetoPesquisaId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(materiaId, projetoPesquisaId),
  FOREIGN KEY (materiaId) REFERENCES Materia(id) ON DELETE CASCADE,
  FOREIGN KEY (projetoPesquisaId) REFERENCES ProjetoPesquisa(id) ON DELETE CASCADE
);

-- Tabela de Associação Materia-ProjetoExtensao
CREATE TABLE IF NOT EXISTS MateriaProjetoExtensao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materiaId INTEGER NOT NULL,
  projetoExtensaoId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(materiaId, projetoExtensaoId),
  FOREIGN KEY (materiaId) REFERENCES Materia(id) ON DELETE CASCADE,
  FOREIGN KEY (projetoExtensaoId) REFERENCES ProjetoExtensao(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projetoPesquisa_profesor ON ProjetoPesquisa(professorCoordenadorId);
CREATE INDEX IF NOT EXISTS idx_projetoExtensao_profesor ON ProjetoExtensao(professorCoordenadorId);
CREATE INDEX IF NOT EXISTS idx_materia_professor_materia ON MateriaProfessor(materiaId);
CREATE INDEX IF NOT EXISTS idx_materia_pesquisa_materia ON MateriaProjetoPesquisa(materiaId);
CREATE INDEX IF NOT EXISTS idx_materia_extensao_materia ON MateriaProjetoExtensao(materiaId);
