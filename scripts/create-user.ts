import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser() {
  try {
    const user = await prisma.usuario.create({
      data: {
        nome: "Luan Mendes",
        email: "luan@pucminas.br",
        senha: "senha123",
        cargo: "Aluno",
      },
    });

    console.log("✅ Usuário criado com sucesso!");
    console.log(JSON.stringify(user, null, 2));
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("❌ Erro: Este email já existe");
    } else {
      console.error("❌ Erro ao criar usuário:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
