-- CreateTable
CREATE TABLE "ProfessorCoordenador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessorCoordenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetoPesquisa" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "areaTemática" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "momentoOcorre" TIMESTAMP(3) NOT NULL,
    "problemaPesquisa" TEXT NOT NULL,
    "metodologia" TEXT NOT NULL,
    "resultadosEsperados" TEXT NOT NULL,
    "imagem" TEXT,
    "professorCoordenadorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjetoPesquisa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetoExtensao" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "areaTemática" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "momentoOcorre" TIMESTAMP(3) NOT NULL,
    "tipoPessoasProcuram" TEXT NOT NULL,
    "comunidadeEnvolvida" TEXT NOT NULL,
    "imagem" TEXT,
    "professorCoordenadorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjetoExtensao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaProfessor" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "tipoCoordenacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MateriaProfessor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaProjetoPesquisa" (
    "id" SERIAL NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "projetoPesquisaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MateriaProjetoPesquisa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaProjetoExtensao" (
    "id" SERIAL NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "projetoExtensaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MateriaProjetoExtensao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "responsavel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "local" TEXT,
    "curso" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "descricao" TEXT,
    "imagem" TEXT,
    "documento" TEXT,
    "link" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OdsEvento" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "odsNumero" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OdsEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnexoEvento" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnexoEvento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorCoordenador_email_key" ON "ProfessorCoordenador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_nome_key" ON "Materia"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "MateriaProfessor_professorId_materiaId_tipoCoordenacao_key" ON "MateriaProfessor"("professorId", "materiaId", "tipoCoordenacao");

-- CreateIndex
CREATE UNIQUE INDEX "MateriaProjetoPesquisa_materiaId_projetoPesquisaId_key" ON "MateriaProjetoPesquisa"("materiaId", "projetoPesquisaId");

-- CreateIndex
CREATE UNIQUE INDEX "MateriaProjetoExtensao_materiaId_projetoExtensaoId_key" ON "MateriaProjetoExtensao"("materiaId", "projetoExtensaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OdsEvento_eventoId_odsNumero_key" ON "OdsEvento"("eventoId", "odsNumero");

-- AddForeignKey
ALTER TABLE "ProjetoPesquisa" ADD CONSTRAINT "ProjetoPesquisa_professorCoordenadorId_fkey" FOREIGN KEY ("professorCoordenadorId") REFERENCES "ProfessorCoordenador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoExtensao" ADD CONSTRAINT "ProjetoExtensao_professorCoordenadorId_fkey" FOREIGN KEY ("professorCoordenadorId") REFERENCES "ProfessorCoordenador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaProfessor" ADD CONSTRAINT "MateriaProfessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "ProfessorCoordenador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaProfessor" ADD CONSTRAINT "MateriaProfessor_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaProjetoPesquisa" ADD CONSTRAINT "MateriaProjetoPesquisa_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaProjetoPesquisa" ADD CONSTRAINT "MateriaProjetoPesquisa_projetoPesquisaId_fkey" FOREIGN KEY ("projetoPesquisaId") REFERENCES "ProjetoPesquisa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaProjetoExtensao" ADD CONSTRAINT "MateriaProjetoExtensao_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaProjetoExtensao" ADD CONSTRAINT "MateriaProjetoExtensao_projetoExtensaoId_fkey" FOREIGN KEY ("projetoExtensaoId") REFERENCES "ProjetoExtensao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdsEvento" ADD CONSTRAINT "OdsEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnexoEvento" ADD CONSTRAINT "AnexoEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
