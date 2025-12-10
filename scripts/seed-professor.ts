import "dotenv/config";

const API_URL = process.env.VITE_API_URL || "http://localhost:3000/api";

async function seedProfessor() {
  try {
    console.log(`📡 Connecting to API at ${API_URL}...`);

    const professorData = {
      nome: "humberto",
      email: "humberto@sga.pucminas.br",
      senha: "123456",
      curso: "Análise e Desenvolvimento de Sistemas",
    };

    const response = await fetch(`${API_URL}/professores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(professorData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create professor: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Professor criado com sucesso!");
    console.log("📧 Email:", data.email);
    console.log("👤 Nome:", data.nome);
    console.log("🔑 Senha:", data.senha);
    console.log("🏫 Curso:", data.curso);
  } catch (error) {
    console.error("❌ Erro ao criar professor:", error);
    process.exit(1);
  }
}

seedProfessor();
