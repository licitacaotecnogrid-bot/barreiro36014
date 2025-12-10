import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleGetUsuarios,
  handleCreateUsuario,
  handleUpdateUsuario,
  handleDeleteUsuario,
} from "./routes/usuarios";
import {
  handleGetEventos,
  handleGetEventoById,
  handleCreateEvento,
  handleUpdateEvento,
  handleDeleteEvento,
} from "./routes/eventos";
import {
  handleGetComentarios,
  handleCreateComentario,
  handleDeleteComentario,
  handleUpdateComentario,
} from "./routes/comentarios";
import prisma from "./prisma";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Usuários endpoints
  app.post("/api/login", handleLogin);
  app.get("/api/usuarios", handleGetUsuarios);
  app.post("/api/usuarios", handleCreateUsuario);
  app.put("/api/usuarios/:id", handleUpdateUsuario);
  app.delete("/api/usuarios/:id", handleDeleteUsuario);

  // Eventos endpoints
  app.get("/api/eventos", handleGetEventos);
  app.get("/api/eventos/:id", handleGetEventoById);
  app.post("/api/eventos", handleCreateEvento);
  app.put("/api/eventos/:id", handleUpdateEvento);
  app.delete("/api/eventos/:id", handleDeleteEvento);

  // Comentários endpoints
  app.get("/api/eventos/:eventoId/comentarios", handleGetComentarios);
  app.post("/api/eventos/:eventoId/comentarios", handleCreateComentario);
  app.put("/api/eventos/:eventoId/comentarios/:comentarioId", handleUpdateComentario);
  app.delete("/api/eventos/:eventoId/comentarios/:comentarioId", handleDeleteComentario);

  // Coordenadores endpoints (for project coordinators)
  app.get("/api/professores", async (_req, res) => {
    try {
      // Get coordinators from Usuario table with "Coordenador" cargo
      const coordenadores = await prisma.usuario.findMany({
        where: {
          cargo: "Coordenador",
        },
      });

      res.json(coordenadores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coordinators" });
    }
  });

  app.post("/api/professores", async (req, res) => {
    try {
      const { nome, email, senha, curso } = req.body;
      if (!nome || !email || !senha || !curso) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const professor = await prisma.professorCoordenador.create({
        data: { nome, email, senha, curso },
      });
      res.status(201).json(professor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create professor" });
    }
  });

  app.get("/api/professores/:id", async (req, res) => {
    try {
      const professor = await prisma.professorCoordenador.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!professor) {
        return res.status(404).json({ error: "Professor not found" });
      }
      res.json(professor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch professor" });
    }
  });

  app.put("/api/professores/:id", async (req, res) => {
    try {
      const { nome, email, senha, curso } = req.body;
      const professor = await prisma.professorCoordenador.update({
        where: { id: parseInt(req.params.id) },
        data: {
          ...(nome && { nome }),
          ...(email && { email }),
          ...(senha && { senha }),
          ...(curso && { curso }),
        },
      });
      res.json(professor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update professor" });
    }
  });

  app.delete("/api/professores/:id", async (req, res) => {
    try {
      const professor = await prisma.professorCoordenador.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!professor) {
        return res.status(404).json({ error: "Professor not found" });
      }
      await prisma.professorCoordenador.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json(professor);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete professor" });
    }
  });

  // Projeto Pesquisa endpoints
  app.get("/api/projetos-pesquisa", async (_req, res) => {
    try {
      const projetos = await prisma.projetoPesquisa.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(projetos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch research projects" });
    }
  });

  app.post("/api/projetos-pesquisa", async (req, res) => {
    try {
      const { titulo, areaTematica, descricao, momentoOcorre, problemaPesquisa, metodologia, resultadosEsperados, imagem, professorCoordenadorId } = req.body;
      const projeto = await prisma.projetoPesquisa.create({
        data: {
          titulo,
          areaTematica,
          descricao,
          momentoOcorre: new Date(momentoOcorre),
          problemaPesquisa,
          metodologia,
          resultadosEsperados,
          imagem,
          professorCoordenadorId,
        },
      });
      res.status(201).json(projeto);
    } catch (error) {
      console.error("Error creating research project:", error);
      res.status(500).json({ error: "Failed to create research project" });
    }
  });

  app.get("/api/projetos-pesquisa/:id", async (req, res) => {
    try {
      const projeto = await prisma.projetoPesquisa.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!projeto) {
        return res.status(404).json({ error: "Projeto de pesquisa not found" });
      }
      res.json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch research project" });
    }
  });

  app.put("/api/projetos-pesquisa/:id", async (req, res) => {
    try {
      const { titulo, areaTematica, descricao, momentoOcorre, problemaPesquisa, metodologia, resultadosEsperados, imagem } = req.body;
      const projeto = await prisma.projetoPesquisa.update({
        where: { id: parseInt(req.params.id) },
        data: {
          ...(titulo && { titulo }),
          ...(areaTematica && { areaTematica }),
          ...(descricao && { descricao }),
          ...(momentoOcorre && { momentoOcorre: new Date(momentoOcorre) }),
          ...(problemaPesquisa && { problemaPesquisa }),
          ...(metodologia && { metodologia }),
          ...(resultadosEsperados && { resultadosEsperados }),
          ...(imagem && { imagem }),
        },
      });
      res.json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Failed to update research project" });
    }
  });

  app.delete("/api/projetos-pesquisa/:id", async (req, res) => {
    try {
      const projeto = await prisma.projetoPesquisa.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!projeto) {
        return res.status(404).json({ error: "Projeto de pesquisa not found" });
      }
      await prisma.projetoPesquisa.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete research project" });
    }
  });

  // Projeto Extensão endpoints
  app.get("/api/projetos-extensao", async (_req, res) => {
    try {
      const projetos = await prisma.projetoExtensao.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(projetos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch extension projects" });
    }
  });

  app.post("/api/projetos-extensao", async (req, res) => {
    try {
      const { titulo, areaTematica, descricao, momentoOcorre, tipoPessoasProcuram, comunidadeEnvolvida, imagem, professorCoordenadorId } = req.body;
      const projeto = await prisma.projetoExtensao.create({
        data: {
          titulo,
          areaTematica,
          descricao,
          momentoOcorre: new Date(momentoOcorre),
          tipoPessoasProcuram,
          comunidadeEnvolvida,
          imagem,
          professorCoordenadorId,
        },
      });
      res.status(201).json(projeto);
    } catch (error) {
      console.error("Error creating extension project:", error);
      res.status(500).json({ error: "Failed to create extension project" });
    }
  });

  app.get("/api/projetos-extensao/:id", async (req, res) => {
    try {
      const projeto = await prisma.projetoExtensao.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!projeto) {
        return res.status(404).json({ error: "Projeto de extensão not found" });
      }
      res.json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch extension project" });
    }
  });

  app.put("/api/projetos-extensao/:id", async (req, res) => {
    try {
      const { titulo, areaTematica, descricao, momentoOcorre, tipoPessoasProcuram, comunidadeEnvolvida, imagem } = req.body;
      const projeto = await prisma.projetoExtensao.update({
        where: { id: parseInt(req.params.id) },
        data: {
          ...(titulo && { titulo }),
          ...(areaTematica && { areaTematica }),
          ...(descricao && { descricao }),
          ...(momentoOcorre && { momentoOcorre: new Date(momentoOcorre) }),
          ...(tipoPessoasProcuram && { tipoPessoasProcuram }),
          ...(comunidadeEnvolvida && { comunidadeEnvolvida }),
          ...(imagem && { imagem }),
        },
      });
      res.json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Failed to update extension project" });
    }
  });

  app.delete("/api/projetos-extensao/:id", async (req, res) => {
    try {
      const projeto = await prisma.projetoExtensao.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!projeto) {
        return res.status(404).json({ error: "Projeto de extensão not found" });
      }
      await prisma.projetoExtensao.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete extension project" });
    }
  });

  // Materia endpoints
  app.get("/api/materias", async (_req, res) => {
    try {
      const materias = await prisma.materia.findMany();
      res.json(materias);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  app.post("/api/materias", async (req, res) => {
    try {
      const { nome, descricao } = req.body;
      const materia = await prisma.materia.create({
        data: { nome, descricao },
      });
      res.status(201).json(materia);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subject" });
    }
  });

  app.get("/api/materias/:id", async (req, res) => {
    try {
      const materia = await prisma.materia.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!materia) {
        return res.status(404).json({ error: "Materia not found" });
      }
      res.json(materia);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subject" });
    }
  });

  app.put("/api/materias/:id", async (req, res) => {
    try {
      const { nome, descricao } = req.body;
      const materia = await prisma.materia.update({
        where: { id: parseInt(req.params.id) },
        data: {
          ...(nome && { nome }),
          ...(descricao && { descricao }),
        },
      });
      res.json(materia);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subject" });
    }
  });

  app.delete("/api/materias/:id", async (req, res) => {
    try {
      const materia = await prisma.materia.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!materia) {
        return res.status(404).json({ error: "Materia not found" });
      }
      await prisma.materia.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json(materia);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subject" });
    }
  });

  return app;
}
