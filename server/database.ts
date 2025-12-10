import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.join(__dirname, '../prisma/dev.db');

// Verificar se o banco existe, se não, criar
if (!fs.existsSync(dbPath)) {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Criar o banco com o schema
  const db = new Database(dbPath);
  const schemaPath = path.join(__dirname, '../database/init.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  schema.split(';').forEach((statement) => {
    if (statement.trim()) {
      db.exec(statement);
    }
  });
  
  db.close();
}

// Conectar ao banco
const db = new Database(dbPath);

// Habili WAL mode para melhor concorrência
db.pragma('journal_mode = WAL');

// Queries preparadas para ProfessorCoordenador
export const professorQueries = {
  getAll: db.prepare('SELECT * FROM ProfessorCoordenador'),
  getById: db.prepare('SELECT * FROM ProfessorCoordenador WHERE id = ?'),
  getByEmail: db.prepare('SELECT * FROM ProfessorCoordenador WHERE email = ?'),
  create: db.prepare(`
    INSERT INTO ProfessorCoordenador (nome, email, senha, curso)
    VALUES (?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE ProfessorCoordenador
    SET nome = ?, email = ?, senha = ?, curso = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM ProfessorCoordenador WHERE id = ?'),
};

// Queries preparadas para ProjetoPesquisa
export const projetoPesquisaQueries = {
  getAll: db.prepare('SELECT * FROM ProjetoPesquisa ORDER BY createdAt DESC'),
  getById: db.prepare('SELECT * FROM ProjetoPesquisa WHERE id = ?'),
  getByProfessor: db.prepare('SELECT * FROM ProjetoPesquisa WHERE professorCoordenadorId = ? ORDER BY createdAt DESC'),
  create: db.prepare(`
    INSERT INTO ProjetoPesquisa (titulo, areaTematica, descricao, momentoOcorre, problemaPesquisa, metodologia, resultadosEsperados, imagem, professorCoordenadorId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE ProjetoPesquisa
    SET titulo = ?, areaTematica = ?, descricao = ?, momentoOcorre = ?, problemaPesquisa = ?, metodologia = ?, resultadosEsperados = ?, imagem = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM ProjetoPesquisa WHERE id = ?'),
};

// Queries preparadas para ProjetoExtensao
export const projetoExtensaoQueries = {
  getAll: db.prepare('SELECT * FROM ProjetoExtensao ORDER BY createdAt DESC'),
  getById: db.prepare('SELECT * FROM ProjetoExtensao WHERE id = ?'),
  getByProfessor: db.prepare('SELECT * FROM ProjetoExtensao WHERE professorCoordenadorId = ? ORDER BY createdAt DESC'),
  create: db.prepare(`
    INSERT INTO ProjetoExtensao (titulo, areaTematica, descricao, momentoOcorre, tipoPessoasProcuram, comunidadeEnvolvida, imagem, professorCoordenadorId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE ProjetoExtensao
    SET titulo = ?, areaTematica = ?, descricao = ?, momentoOcorre = ?, tipoPessoasProcuram = ?, comunidadeEnvolvida = ?, imagem = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM ProjetoExtensao WHERE id = ?'),
};

// Queries preparadas para Materia
export const materiaQueries = {
  getAll: db.prepare('SELECT * FROM Materia'),
  getById: db.prepare('SELECT * FROM Materia WHERE id = ?'),
  getByNome: db.prepare('SELECT * FROM Materia WHERE nome = ?'),
  create: db.prepare(`
    INSERT INTO Materia (nome, descricao)
    VALUES (?, ?)
  `),
  update: db.prepare(`
    UPDATE Materia
    SET nome = ?, descricao = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM Materia WHERE id = ?'),
};

// Queries preparadas para MateriaProfessor
export const materiaProfessorQueries = {
  getAll: db.prepare('SELECT * FROM MateriaProfessor'),
  getByMateria: db.prepare('SELECT * FROM MateriaProfessor WHERE materiaId = ?'),
  getByProfessor: db.prepare('SELECT * FROM MateriaProfessor WHERE professorId = ?'),
  create: db.prepare(`
    INSERT INTO MateriaProfessor (professorId, materiaId, tipoCoordenacao)
    VALUES (?, ?, ?)
  `),
  delete: db.prepare('DELETE FROM MateriaProfessor WHERE id = ?'),
};

export function getDatabase() {
  return db;
}

export function closeDatabase() {
  db.close();
}
