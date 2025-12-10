import { RequestHandler } from "express";
import prisma from "../prisma";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ error: "Email e senha são obrigatórios" });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      res.status(401).json({ error: "Usuário não encontrado" });
      return;
    }

    if (usuario.senha !== senha) {
      res.status(401).json({ error: "Senha incorreta" });
      return;
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

export const handleGetUsuarios: RequestHandler = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
      },
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const handleCreateUsuario: RequestHandler = async (req, res) => {
  try {
    const { nome, email, senha, cargo, curso } = req.body;

    if (!nome || !email || !senha || !cargo) {
      res.status(400).json({ error: "Todos os campos são obrigatórios" });
      return;
    }

    // Create user in Usuario table
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        cargo,
      },
    });

    // If cargo is Professor, also create in ProfessorCoordenador table
    if (cargo === "Professor") {
      await prisma.professorCoordenador.create({
        data: {
          nome,
          email,
          senha,
          curso: curso || "Análise e Desenvolvimento de Sistemas",
        },
      });
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Email já cadastrado" });
    } else {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
};

export const handleUpdateUsuario: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, senha, cargo } = req.body;

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        ...(nome && { nome }),
        ...(senha && { senha }),
        ...(cargo && { cargo }),
      },
    });

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const handleDeleteUsuario: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
