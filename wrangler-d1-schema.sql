-- ProfessorCoordenador table
CREATE TABLE IF NOT EXISTS professor_coordenador (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  curso TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Materia table
CREATE TABLE IF NOT EXISTS materia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ProjetoPesquisa table
CREATE TABLE IF NOT EXISTS projeto_pesquisa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  area_tematica TEXT NOT NULL,
  descricao TEXT NOT NULL,
  momento_ocorre DATETIME NOT NULL,
  problema_pesquisa TEXT NOT NULL,
  metodologia TEXT NOT NULL,
  resultados_esperados TEXT NOT NULL,
  imagem TEXT,
  professor_coordenador_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professor_coordenador_id) REFERENCES professor_coordenador(id) ON DELETE CASCADE
);

-- ProjetoExtensao table
CREATE TABLE IF NOT EXISTS projeto_extensao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  area_tematica TEXT NOT NULL,
  descricao TEXT NOT NULL,
  momento_ocorre DATETIME NOT NULL,
  tipo_pessoas_procuram TEXT NOT NULL,
  comunidade_envolvida TEXT NOT NULL,
  imagem TEXT,
  professor_coordenador_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professor_coordenador_id) REFERENCES professor_coordenador(id) ON DELETE CASCADE
);

-- MateriaProfessor table
CREATE TABLE IF NOT EXISTS materia_professor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  professor_id INTEGER NOT NULL,
  materia_id INTEGER NOT NULL,
  tipo_coordenacao TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(professor_id, materia_id, tipo_coordenacao),
  FOREIGN KEY (professor_id) REFERENCES professor_coordenador(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materia(id) ON DELETE CASCADE
);

-- MateriaProjetoPesquisa table
CREATE TABLE IF NOT EXISTS materia_projeto_pesquisa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materia_id INTEGER NOT NULL,
  projeto_pesquisa_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(materia_id, projeto_pesquisa_id),
  FOREIGN KEY (materia_id) REFERENCES materia(id) ON DELETE CASCADE,
  FOREIGN KEY (projeto_pesquisa_id) REFERENCES projeto_pesquisa(id) ON DELETE CASCADE
);

-- MateriaProjetoExtensao table
CREATE TABLE IF NOT EXISTS materia_projeto_extensao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materia_id INTEGER NOT NULL,
  projeto_extensao_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(materia_id, projeto_extensao_id),
  FOREIGN KEY (materia_id) REFERENCES materia(id) ON DELETE CASCADE,
  FOREIGN KEY (projeto_extensao_id) REFERENCES projeto_extensao(id) ON DELETE CASCADE
);

-- Usuario table
CREATE TABLE IF NOT EXISTS usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  cargo TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Evento table
CREATE TABLE IF NOT EXISTS evento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  data DATETIME NOT NULL,
  responsavel TEXT NOT NULL,
  status TEXT NOT NULL,
  local TEXT,
  curso TEXT NOT NULL,
  tipo_evento TEXT NOT NULL,
  modalidade TEXT NOT NULL,
  descricao TEXT,
  imagem TEXT,
  documento TEXT,
  link TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OdsEvento table
CREATE TABLE IF NOT EXISTS ods_evento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL,
  ods_numero INTEGER NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(evento_id, ods_numero),
  FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE
);

-- AnexoEvento table
CREATE TABLE IF NOT EXISTS anexo_evento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE
);

-- ComentarioEvento table
CREATE TABLE IF NOT EXISTS comentario_evento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id INTEGER NOT NULL,
  usuario_id INTEGER,
  autor TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projeto_pesquisa_professor ON projeto_pesquisa(professor_coordenador_id);
CREATE INDEX IF NOT EXISTS idx_projeto_extensao_professor ON projeto_extensao(professor_coordenador_id);
CREATE INDEX IF NOT EXISTS idx_materia_professor ON materia_professor(professor_id);
CREATE INDEX IF NOT EXISTS idx_materia_projeto_pesquisa ON materia_projeto_pesquisa(projeto_pesquisa_id);
CREATE INDEX IF NOT EXISTS idx_materia_projeto_extensao ON materia_projeto_extensao(projeto_extensao_id);
CREATE INDEX IF NOT EXISTS idx_evento_data ON evento(data);
CREATE INDEX IF NOT EXISTS idx_ods_evento ON ods_evento(evento_id);
CREATE INDEX IF NOT EXISTS idx_anexo_evento ON anexo_evento(evento_id);
CREATE INDEX IF NOT EXISTS idx_comentario_evento ON comentario_evento(evento_id);
CREATE INDEX IF NOT EXISTS idx_comentario_usuario ON comentario_evento(usuario_id);
