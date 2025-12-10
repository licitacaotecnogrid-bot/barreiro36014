import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  await prisma.$executeRawUnsafe("TRUNCATE TABLE \"Usuario\" CASCADE");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE \"Evento\" CASCADE");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE \"ProfessorCoordenador\" CASCADE");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE \"ProjetoPesquisa\" CASCADE");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE \"ProjetoExtensao\" CASCADE");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE \"Materia\" CASCADE");

  console.log("✓ Tabelas limpas");

  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: "Prof. Ana",
        email: "ana@pucminas.br",
        cargo: "Professora",
        senha: "senha123",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Prof. Carlos",
        email: "carlos@pucminas.br",
        cargo: "Professor",
        senha: "senha123",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Coord. Júlia",
        email: "julia@pucminas.br",
        cargo: "Coordenadora",
        senha: "senha123",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "João Silva",
        email: "joao.silva@pucminas.br",
        cargo: "Aluno",
        senha: "senha123",
      },
    }),
  ]);

  console.log(`✓ ${usuarios.length} usuários criados`);

  const professores = await Promise.all([
    prisma.professorCoordenador.create({
      data: {
        nome: "Prof. Ana Silva",
        email: "ana.silva@pucminas.br",
        senha: "senha123",
        curso: "Análise e Desenvolvimento de Sistemas",
      },
    }),
    prisma.professorCoordenador.create({
      data: {
        nome: "Prof. Carlos Oliveira",
        email: "carlos.oliveira@pucminas.br",
        senha: "senha123",
        curso: "Análise e Desenvolvimento de Sistemas",
      },
    }),
    prisma.professorCoordenador.create({
      data: {
        nome: "Prof. Júlia Costa",
        email: "julia.costa@pucminas.br",
        senha: "senha123",
        curso: "Análise e Desenvolvimento de Sistemas",
      },
    }),
    prisma.professorCoordenador.create({
      data: {
        nome: "Prof. Marcos Santos",
        email: "marcos.santos@pucminas.br",
        senha: "senha123",
        curso: "Análise e Desenvolvimento de Sistemas",
      },
    }),
  ]);

  console.log(`✓ ${professores.length} professores criados`);

  const materia = await prisma.materia.create({
    data: {
      nome: "Análise e Desenvolvimento de Sistemas",
      descricao: "Programa de análise e desenvolvimento de sistemas computacionais",
    },
  });

  console.log("✓ Matéria criada");

  const projetosPesquisa = await Promise.all([
    prisma.projetoPesquisa.create({
      data: {
        titulo: "Análise de Padrões de Segurança em Aplicações Web",
        areaTematica: "Segurança da Informação",
        descricao: "Pesquisa sobre vulnerabilidades e padrões de segurança em aplicações web modernas",
        momentoOcorre: new Date("2025-03-15"),
        problemaPesquisa: "Quais são os padrões de vulnerabilidade mais comuns em aplicações web?",
        metodologia: "Análise de código-fonte, testes de penetração e revisão de literatura",
        resultadosEsperados: "Documentação de vulnerabilidades comuns e recomendações de segurança",
        professorCoordenadorId: professores[0].id,
      },
    }),
    prisma.projetoPesquisa.create({
      data: {
        titulo: "Otimização de Algoritmos em Computação em Nuvem",
        areaTematica: "Computação em Nuvem",
        descricao: "Estudo sobre otimização de recursos em ambientes de nuvem",
        momentoOcorre: new Date("2025-04-20"),
        problemaPesquisa: "Como otimizar a distribuição de recursos em computação em nuvem?",
        metodologia: "Simulação computacional e análise de dados",
        resultadosEsperados: "Algoritmos otimizados e métricas de desempenho",
        professorCoordenadorId: professores[1].id,
      },
    }),
  ]);

  console.log(`✓ ${projetosPesquisa.length} projetos de pesquisa criados`);

  const projetosExtensao = await Promise.all([
    prisma.projetoExtensao.create({
      data: {
        titulo: "Workshop: Desenvolvimento Mobile para Iniciantes",
        areaTematica: "Desenvolvimento Mobile",
        momentoOcorre: new Date("2025-03-15"),
        descricao: "Workshop prático de desenvolvimento de aplicações mobile para a comunidade local",
        tipoPessoasProcuram: "Estudantes de programação e desenvolvedores iniciantes",
        comunidadeEnvolvida: "Comunidade de tecnologia local da região de Belo Horizonte",
        professorCoordenadorId: professores[0].id,
      },
    }),
    prisma.projetoExtensao.create({
      data: {
        titulo: "Programa de Mentoria em Desenvolvimento Full Stack",
        areaTematica: "Desenvolvimento Full Stack",
        momentoOcorre: new Date("2025-04-01"),
        descricao: "Programa de mentoria oferecido para a comunidade externa em desenvolvimento full stack",
        tipoPessoasProcuram: "Profissionais em transição de carreira e autodidatas",
        comunidadeEnvolvida: "Agências de desenvolvimento local e startups",
        professorCoordenadorId: professores[2].id,
      },
    }),
  ]);

  console.log(`✓ ${projetosExtensao.length} projetos de extensão criados`);

  const eventos = await Promise.all([
    prisma.evento.create({
      data: {
        titulo: "Workshop: Desenvolvimento Mobile",
        data: new Date("2025-03-15"),
        responsavel: "Prof. Ana",
        status: "Confirmado",
        modalidade: "Presencial",
        local: "Auditório A",
        curso: "Análise e Desenvolvimento de Sistemas",
        tipoEvento: "Projeto de Extensão",
        descricao: "Workshop prático de desenvolvimento de aplicações mobile usando as melhores práticas da indústria.",
        odsAssociadas: {
          create: [
            { odsNumero: 4 },
            { odsNumero: 9 },
            { odsNumero: 17 },
          ],
        },
      },
    }),
    prisma.evento.create({
      data: {
        titulo: "Palestra: Arquitetura de Software",
        data: new Date("2025-03-22"),
        responsavel: "Prof. Carlos",
        status: "Pendente",
        modalidade: "Presencial",
        local: "Sala 204",
        curso: "Análise e Desenvolvimento de Sistemas",
        tipoEvento: "Pesquisa",
        documento: "https://cdn.builder.io/o/assets%2F737d34773afb48d69db7c942a61ff110%2Fpalestra-arquitetura.pdf",
        descricao: "Exploração aprofundada de padrões e princípios de arquitetura de software.",
        odsAssociadas: {
          create: [
            { odsNumero: 9 },
          ],
        },
      },
    }),
    prisma.evento.create({
      data: {
        titulo: "Hackathon de Sistemas",
        data: new Date("2025-04-05"),
        responsavel: "Prof. Júlia",
        status: "Cancelado",
        modalidade: "Presencial",
        local: "Auditório B",
        curso: "Análise e Desenvolvimento de Sistemas",
        tipoEvento: "Projeto de Extensão",
        descricao: "Competição de programação onde equipes desenvolvem soluções inovadoras para problemas reais.",
        odsAssociadas: {
          create: [
            { odsNumero: 4 },
            { odsNumero: 8 },
            { odsNumero: 9 },
            { odsNumero: 17 },
          ],
        },
      },
    }),
    prisma.evento.create({
      data: {
        titulo: "Seminário: DevOps e CI/CD",
        data: new Date("2025-04-18"),
        responsavel: "Prof. Marcos",
        status: "Confirmado",
        modalidade: "Híbrido",
        local: "Hall Principal",
        link: "https://meet.google.com/abc-defg-hij",
        curso: "Análise e Desenvolvimento de Sistemas",
        tipoEvento: "Pesquisa",
        documento: "https://cdn.builder.io/o/assets%2F737d34773afb48d69db7c942a61ff110%2Fseminario-devops.docx",
        descricao: "Seminário sobre práticas modernas de DevOps, automação de deployment e integração contínua.",
        odsAssociadas: {
          create: [
            { odsNumero: 9 },
            { odsNumero: 12 },
          ],
        },
      },
    }),
  ]);

  console.log(`✓ ${eventos.length} eventos criados`);

  console.log("✅ Seed completado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao fazer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
