import { PrismaClient } from "@prisma/client";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("\n📝 Criar Novo Usuário\n");

  const nome = await question("Nome completo: ");
  const email = await question("E-mail (ex: nome@pucminas.br): ");
  const senha = await question("Senha: ");
  const cargo = await question("Cargo (Aluno/Professor/Coordenador) [Aluno]: ") || "Aluno";

  if (!nome.trim() || !email.trim() || !senha.trim()) {
    console.error("❌ Nome, email e senha são obrigatórios");
    rl.close();
    process.exit(1);
  }

  try {
    console.log("\n⏳ Criando usuário...");
    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        cargo,
      },
    });

    console.log("\n✅ Usuário criado com sucesso!\n");
    console.log(`ID:    ${user.id}`);
    console.log(`Nome:  ${user.nome}`);
    console.log(`Email: ${user.email}`);
    console.log(`Cargo: ${user.cargo}`);
    console.log(`Criado em: ${new Date(user.criadoEm).toLocaleString("pt-BR")}\n`);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error(`\n❌ Erro: O email "${email}" já está cadastrado`);
    } else {
      console.error(`\n❌ Erro ao criar usuário: ${error.message}`);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main();
