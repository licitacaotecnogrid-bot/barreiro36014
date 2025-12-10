import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(__dirname, '../prisma/dev.db');

// Criar diretório se não existir
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Ler e executar o schema
const schemaPath = path.join(__dirname, './init.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Executar cada statement do schema
schema.split(';').forEach((statement) => {
  if (statement.trim()) {
    db.exec(statement);
  }
});

console.log('✅ Tabelas criadas com sucesso!');

// Dados de exemplo
const professores = [
  { nome: 'Prof. Ana Silva', email: 'ana.silva@pucminas.br', senha: 'senha123', curso: 'Análise e Desenvolvimento de Sistemas' },
  { nome: 'Prof. Carlos Oliveira', email: 'carlos.oliveira@pucminas.br', senha: 'senha123', curso: 'Análise e Desenvolvimento de Sistemas' },
  { nome: 'Prof. Júlia Costa', email: 'julia.costa@pucminas.br', senha: 'senha123', curso: 'Análise e Desenvolvimento de Sistemas' },
  { nome: 'Prof. Marcos Santos', email: 'marcos.santos@pucminas.br', senha: 'senha123', curso: 'Análise e Desenvolvimento de Sistemas' },
];

const materias = [
  { nome: 'Análise e Desenvolvimento de Sistemas', descricao: 'Programa de análise e desenvolvimento de sistemas computacionais' },
];

// Inserir professores
const insertProfessor = db.prepare(`
  INSERT OR IGNORE INTO ProfessorCoordenador (nome, email, senha, curso)
  VALUES (?, ?, ?, ?)
`);

professores.forEach((prof) => {
  insertProfessor.run(prof.nome, prof.email, prof.senha, prof.curso);
});

console.log('✅ Professores inseridos!');

// Inserir matérias
const insertMateria = db.prepare(`
  INSERT OR IGNORE INTO Materia (nome, descricao)
  VALUES (?, ?)
`);

materias.forEach((materia) => {
  insertMateria.run(materia.nome, materia.descricao);
});

console.log('✅ Matérias inseridas!');

// Associar professores às matérias
const insertMateriaProf = db.prepare(`
  INSERT OR IGNORE INTO MateriaProfessor (professorId, materiaId, tipoCoordenacao)
  VALUES (?, ?, ?)
`);

const getProfId = db.prepare(`SELECT id FROM ProfessorCoordenador WHERE email = ?`);
const getMateriaId = db.prepare(`SELECT id FROM Materia WHERE nome = ?`);

const prof1 = getProfId.get('ana.silva@pucminas.br') as { id: number };
const prof2 = getProfId.get('carlos.oliveira@pucminas.br') as { id: number };
const prof3 = getProfId.get('julia.costa@pucminas.br') as { id: number };
const materia = getMateriaId.get('Análise e Desenvolvimento de Sistemas') as { id: number };

if (prof1 && materia) {
  insertMateriaProf.run(prof1.id, materia.id, 'pesquisa');
  insertMateriaProf.run(prof1.id, materia.id, 'extensao');
}

if (prof2 && materia) {
  insertMateriaProf.run(prof2.id, materia.id, 'pesquisa');
}

if (prof3 && materia) {
  insertMateriaProf.run(prof3.id, materia.id, 'extensao');
}

console.log('✅ Associações professor-matéria criadas!');

// Inserir projetos de pesquisa
const insertProjetoPesquisa = db.prepare(`
  INSERT INTO ProjetoPesquisa (titulo, areaTematica, descricao, momentoOcorre, problemaPesquisa, metodologia, resultadosEsperados, professorCoordenadorId)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

if (prof1) {
  insertProjetoPesquisa.run(
    'Análise de Padrões de Segurança em Aplicações Web',
    'Segurança da Informação',
    'Pesquisa sobre vulnerabilidades e padrões de segurança em aplicações web modernas',
    '2025-03-15',
    'Quais são os padrões de vulnerabilidade mais comuns em aplicações web?',
    'Análise de código-fonte, testes de penetração e revisão de literatura',
    'Documentação de vulnerabilidades comuns e recomendações de segurança',
    prof1.id
  );
}

if (prof2) {
  insertProjetoPesquisa.run(
    'Otimização de Algoritmos em Computação em Nuvem',
    'Computação em Nuvem',
    'Estudo sobre otimização de recursos em ambientes de nuvem',
    '2025-04-20',
    'Como otimizar a distribuição de recursos em computação em nuvem?',
    'Simulação computacional e análise de dados',
    'Algoritmos otimizados e métricas de desempenho',
    prof2.id
  );
}

console.log('✅ Projetos de pesquisa inseridos!');

// Inserir projetos de extensão
const insertProjetoExtensao = db.prepare(`
  INSERT INTO ProjetoExtensao (titulo, areaTematica, descricao, momentoOcorre, tipoPessoasProcuram, comunidadeEnvolvida, professorCoordenadorId)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

if (prof1) {
  insertProjetoExtensao.run(
    'Workshop: Desenvolvimento Mobile para Iniciantes',
    'Desenvolvimento Mobile',
    'Workshop prático de desenvolvimento de aplicações mobile para a comunidade local',
    '2025-03-15',
    'Estudantes de programação e desenvolvedores iniciantes',
    'Comunidade de tecnologia local da região de Belo Horizonte',
    prof1.id
  );
}

if (prof3) {
  insertProjetoExtensao.run(
    'Programa de Mentoria em Desenvolvimento Full Stack',
    'Desenvolvimento Full Stack',
    'Programa de mentoria oferecido para a comunidade externa em desenvolvimento full stack',
    '2025-04-01',
    'Profissionais em transição de carreira e autodidatas',
    'Agências de desenvolvimento local e startups',
    prof3.id
  );
}

console.log('✅ Projetos de extensão inseridos!');

db.close();
console.log('✅ Banco de dados inicializado com sucesso!');
console.log('📁 Arquivo do banco: ' + dbPath);
