/*
  Warnings:

  - You are about to drop the column `areaTemática` on the `ProjetoExtensao` table. All the data in the column will be lost.
  - You are about to drop the column `areaTemática` on the `ProjetoPesquisa` table. All the data in the column will be lost.
  - Added the required column `areaTematica` to the `ProjetoExtensao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaTematica` to the `ProjetoPesquisa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjetoExtensao" DROP CONSTRAINT "ProjetoExtensao_professorCoordenadorId_fkey";

-- DropForeignKey
ALTER TABLE "ProjetoPesquisa" DROP CONSTRAINT "ProjetoPesquisa_professorCoordenadorId_fkey";

-- AlterTable
ALTER TABLE "ProjetoExtensao" DROP COLUMN "areaTemática",
ADD COLUMN     "areaTematica" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjetoPesquisa" DROP COLUMN "areaTemática",
ADD COLUMN     "areaTematica" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjetoPesquisa" ADD CONSTRAINT "ProjetoPesquisa_professorCoordenadorId_fkey" FOREIGN KEY ("professorCoordenadorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoExtensao" ADD CONSTRAINT "ProjetoExtensao_professorCoordenadorId_fkey" FOREIGN KEY ("professorCoordenadorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
