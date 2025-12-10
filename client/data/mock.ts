export type Status = "Confirmado" | "Pendente" | "Cancelado";

export const eventos = [
  {
    id: 1,
    titulo: "Workshop: Desenvolvimento Mobile",
    data: "2025-03-15",
    responsavel: "Prof. Ana",
    status: "Confirmado" as Status,
    local: "Auditório A",
    curso: "Análise e Desenvolvimento de Sistemas",
    tipoEvento: "Projeto de Extensão",
    link: "https://www.example.com/evento-1",
    documento: null,
    descricao: "Workshop prático de desenvolvimento de aplicações mobile usando as melhores práticas da indústria. Aprenda desde o básico até tópicos avançados de desenvolvimento mobile.",
    odsAssociadas: [4, 9, 17]
  },
  {
    id: 2,
    titulo: "Palestra: Arquitetura de Software",
    data: "2025-03-22",
    responsavel: "Prof. Carlos",
    status: "Pendente" as Status,
    local: "Sala 204",
    curso: "Análise e Desenvolvimento de Sistemas",
    tipoEvento: "Pesquisa",
    link: null,
    documento: "https://cdn.builder.io/o/assets%2F737d34773afb48d69db7c942a61ff110%2Fpalestra-arquitetura.pdf?alt=media",
    descricao: "Exploração aprofundada de padrões e princípios de arquitetura de software. Discutiremos escalabilidade, manutenibilidade e melhores práticas.",
    odsAssociadas: [9]
  },
  {
    id: 3,
    titulo: "Hackathon de Sistemas",
    data: "2025-04-05",
    responsavel: "Prof. Júlia",
    status: "Cancelado" as Status,
    local: "Auditório B",
    curso: "Análise e Desenvolvimento de Sistemas",
    tipoEvento: "Projeto de Extensão",
    link: "https://www.example.com/evento-3",
    documento: null,
    descricao: "Competição de programação onde equipes desenvolvem soluções inovadoras para problemas reais em um ambiente de desafio.",
    odsAssociadas: [4, 8, 9, 17]
  },
  {
    id: 4,
    titulo: "Seminário: DevOps e CI/CD",
    data: "2025-04-18",
    responsavel: "Prof. Marcos",
    status: "Confirmado" as Status,
    local: "Hall Principal",
    curso: "Análise e Desenvolvimento de Sistemas",
    tipoEvento: "Pesquisa",
    link: null,
    documento: "https://cdn.builder.io/o/assets%2F737d34773afb48d69db7c942a61ff110%2Fseminario-devops.docx?alt=media",
    descricao: "Seminário sobre práticas modernas de DevOps, automação de deployment e integração contínua para desenvolvimento ágil.",
    odsAssociadas: [9, 12]
  },
];

export const usuarios = [
  { id: 1, nome: "Prof. Ana", email: "ana@pucminas.br", cargo: "Professora", senha: "senha123" },
  { id: 2, nome: "Prof. Carlos", email: "carlos@pucminas.br", cargo: "Professor", senha: "senha123" },
  { id: 3, nome: "Coord. Júlia", email: "julia@pucminas.br", cargo: "Coordenadora", senha: "senha123" },
  { id: 4, nome: "João Silva", email: "joao.silva@pucminas.br", cargo: "Aluno", senha: "senha123" },
];

// Professor Coordenador types
export interface ProfessorCoordenador {
  id: number;
  nome: string;
  email: string;
  senha: string;
  curso: string;
}

// Projeto de Pesquisa type
export interface ProjetoPesquisa {
  id: number;
  titulo: string;
  areaTematica: string;
  descricao: string;
  momentoOcorre: string;
  problemaPesquisa: string;
  metodologia: string;
  resultadosEsperados: string;
  imagem?: string | null;
  professorCoordenadorId: number;
}

// Projeto de Extens��o type
export interface ProjetoExtensao {
  id: number;
  titulo: string;
  areaTematica: string;
  momentoOcorre: string;
  descricao: string;
  tipoPessoasProcuram: string;
  comunidadeEnvolvida: string;
  imagem?: string | null;
  professorCoordenadorId: number;
}

// Matéria type
export interface Materia {
  id: number;
  nome: string;
  descricao: string;
  professorCoordenadorPesquisaIds: number[];
  professorCoordenadorExtensaoIds: number[];
  projetoPesquisaIds: number[];
  projetoExtensaoIds: number[];
}

// Mock data for professors
export const professoresCoordinadores: ProfessorCoordenador[] = [
  { id: 1, nome: "Prof. Ana Silva", email: "ana.silva@pucminas.br", senha: "senha123", curso: "Análise e Desenvolvimento de Sistemas" },
  { id: 2, nome: "Prof. Carlos Oliveira", email: "carlos.oliveira@pucminas.br", senha: "senha123", curso: "Análise e Desenvolvimento de Sistemas" },
  { id: 3, nome: "Prof. Júlia Costa", email: "julia.costa@pucminas.br", senha: "senha123", curso: "Análise e Desenvolvimento de Sistemas" },
  { id: 4, nome: "Prof. Marcos Santos", email: "marcos.santos@pucminas.br", senha: "senha123", curso: "Análise e Desenvolvimento de Sistemas" },
];

// Mock data for research projects
export const projetosPesquisa: ProjetoPesquisa[] = [
  {
    id: 1,
    titulo: "Análise de Padrões de Segurança em Aplicações Web",
    areaTematica: "Segurança da Informação",
    descricao: "Pesquisa sobre vulnerabilidades e padrões de segurança em aplicações web modernas",
    momentoOcorre: "2025-03-15",
    problemaPesquisa: "Quais são os padrões de vulnerabilidade mais comuns em aplicações web?",
    metodologia: "Análise de código-fonte, testes de penetração e revisão de literatura",
    resultadosEsperados: "Documentação de vulnerabilidades comuns e recomendações de segurança",
    imagem: null,
    professorCoordenadorId: 1,
  },
  {
    id: 2,
    titulo: "Otimização de Algoritmos em Computação em Nuvem",
    areaTematica: "Computação em Nuvem",
    descricao: "Estudo sobre otimização de recursos em ambientes de nuvem",
    momentoOcorre: "2025-04-20",
    problemaPesquisa: "Como otimizar a distribuição de recursos em computação em nuvem?",
    metodologia: "Simulação computacional e análise de dados",
    resultadosEsperados: "Algoritmos otimizados e métricas de desempenho",
    imagem: null,
    professorCoordenadorId: 2,
  },
];

// Mock data for extension projects
export const projetosExtensao: ProjetoExtensao[] = [
  {
    id: 1,
    titulo: "Workshop: Desenvolvimento Mobile para Iniciantes",
    areaTematica: "Desenvolvimento Mobile",
    momentoOcorre: "2025-03-15",
    descricao: "Workshop prático de desenvolvimento de aplicações mobile para a comunidade local",
    tipoPessoasProcuram: "Estudantes de programação e desenvolvedores iniciantes",
    comunidadeEnvolvida: "Comunidade de tecnologia local da região de Belo Horizonte",
    imagem: null,
    professorCoordenadorId: 1,
  },
  {
    id: 2,
    titulo: "Programa de Mentoria em Desenvolvimento Full Stack",
    areaTematica: "Desenvolvimento Full Stack",
    momentoOcorre: "2025-04-01",
    descricao: "Programa de mentoria oferecido para a comunidade externa em desenvolvimento full stack",
    tipoPessoasProcuram: "Profissionais em transição de carreira e autodidatas",
    comunidadeEnvolvida: "Agências de desenvolvimento local e startups",
    imagem: null,
    professorCoordenadorId: 3,
  },
];

// Mock data for subjects/courses
export const materias: Materia[] = [
  {
    id: 1,
    nome: "An��lise e Desenvolvimento de Sistemas",
    descricao: "Programa de análise e desenvolvimento de sistemas computacionais",
    professorCoordenadorPesquisaIds: [1, 2],
    professorCoordenadorExtensaoIds: [1, 3],
    projetoPesquisaIds: [1, 2],
    projetoExtensaoIds: [1, 2],
  },
];
