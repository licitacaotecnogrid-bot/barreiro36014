-- CreateTable
CREATE TABLE "ComentarioEvento" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "autor" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComentarioEvento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComentarioEvento" ADD CONSTRAINT "ComentarioEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioEvento" ADD CONSTRAINT "ComentarioEvento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
