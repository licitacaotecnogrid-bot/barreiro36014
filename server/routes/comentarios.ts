import { RequestHandler } from "express";
import prisma from "../prisma";

export const handleGetComentarios: RequestHandler = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const comentarios = await prisma.comentarioEvento.findMany({
      where: { eventoId: parseInt(eventoId) },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    res.json(comentarios);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
};

export const handleCreateComentario: RequestHandler = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { usuarioId, autor, conteudo } = req.body;

    if (!autor || !conteudo) {
      res.status(400).json({ error: "Autor e conteúdo são obrigatórios" });
      return;
    }

    const comentario = await prisma.comentarioEvento.create({
      data: {
        eventoId: parseInt(eventoId),
        usuarioId: usuarioId ? parseInt(usuarioId) : null,
        autor,
        conteudo,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(comentario);
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    res.status(500).json({ error: "Erro ao criar comentário" });
  }
};

export const handleDeleteComentario: RequestHandler = async (req, res) => {
  try {
    const { eventoId, comentarioId } = req.params;

    const comentario = await prisma.comentarioEvento.findUnique({
      where: { id: parseInt(comentarioId) },
    });

    if (!comentario) {
      res.status(404).json({ error: "Comentário não encontrado" });
      return;
    }

    if (comentario.eventoId !== parseInt(eventoId)) {
      res.status(400).json({ error: "Comentário não pertence a este evento" });
      return;
    }

    await prisma.comentarioEvento.delete({
      where: { id: parseInt(comentarioId) },
    });

    res.json({ message: "Comentário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar comentário" });
  }
};

export const handleUpdateComentario: RequestHandler = async (req, res) => {
  try {
    const { eventoId, comentarioId } = req.params;
    const { conteudo } = req.body;

    if (!conteudo) {
      res.status(400).json({ error: "Conteúdo é obrigatório" });
      return;
    }

    const comentario = await prisma.comentarioEvento.findUnique({
      where: { id: parseInt(comentarioId) },
    });

    if (!comentario) {
      res.status(404).json({ error: "Comentário não encontrado" });
      return;
    }

    if (comentario.eventoId !== parseInt(eventoId)) {
      res.status(400).json({ error: "Comentário não pertence a este evento" });
      return;
    }

    const updated = await prisma.comentarioEvento.update({
      where: { id: parseInt(comentarioId) },
      data: { conteudo },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar comentário" });
  }
};
