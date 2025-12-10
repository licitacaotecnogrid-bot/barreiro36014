import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const professor = await prisma.professorCoordenador.upsert({
      where: { email: "humberto@sga.pucminas.br" },
      update: {
        nome: "humberto",
        senha: "123456",
        curso: "Análise e Desenvolvimento de Sistemas",
      },
      create: {
        nome: "humberto",
        email: "humberto@sga.pucminas.br",
        senha: "123456",
        curso: "Análise e Desenvolvimento de Sistemas",
      },
    });

    console.log("✅ Professor criado/atualizado com sucesso!");
    console.log("📧 Email:", professor.email);
    console.log("👤 Nome:", professor.nome);
    console.log("🔑 Senha:", professor.senha);
    console.log("🏫 Curso:", professor.curso);
  } catch (error) {
    console.error("❌ Erro ao criar professor:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
