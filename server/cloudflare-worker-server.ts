import { Hono } from "hono";
import { cors } from "hono/cors";
import prisma from "./prisma";

const app = new Hono();

// Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check endpoint
app.get("/api/ping", (c) => {
  return c.json({ message: "pong" });
});

// Demo endpoint
app.get("/api/demo", (c) => {
  return c.json({ message: "Demo endpoint working" });
});

// Usuários endpoints
app.post("/api/login", async (c) => {
  try {
    const { email, senha } = await c.req.json();
    if (!email || !senha) {
      return c.json({ error: "Email e senha são obrigatórios" }, 400);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario || usuario.senha !== senha) {
      return c.json({ error: "Email ou senha inválidos" }, 401);
    }

    return c.json({ id: usuario.id, email: usuario.email, cargo: usuario.cargo });
  } catch (error) {
    return c.json({ error: "Erro ao fazer login" }, 500);
  }
});

app.get("/api/usuarios", async (c) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    return c.json(usuarios);
  } catch (error) {
    return c.json({ error: "Erro ao buscar usuários" }, 500);
  }
});

app.post("/api/usuarios", async (c) => {
  try {
    const data = await c.req.json();
    const usuario = await prisma.usuario.create({ data });
    return c.json(usuario, 201);
  } catch (error) {
    return c.json({ error: "Erro ao criar usuário" }, 500);
  }
});

app.put("/api/usuarios/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data,
    });
    return c.json(usuario);
  } catch (error) {
    return c.json({ error: "Erro ao atualizar usuário" }, 500);
  }
});

app.delete("/api/usuarios/:id", async (c) => {
  try {
    const { id } = c.req.param();
    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });
    return c.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Erro ao deletar usuário" }, 500);
  }
});

// Eventos endpoints
app.get("/api/eventos", async (c) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: { odsAssociadas: true, anexos: true },
      orderBy: { data: "desc" },
    });
    return c.json(eventos);
  } catch (error) {
    return c.json({ error: "Erro ao buscar eventos" }, 500);
  }
});

app.get("/api/eventos/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const evento = await prisma.evento.findUnique({
      where: { id: parseInt(id) },
      include: { odsAssociadas: true, anexos: true },
    });

    if (!evento) {
      return c.json({ error: "Evento não encontrado" }, 404);
    }

    return c.json(evento);
  } catch (error) {
    return c.json({ error: "Erro ao buscar evento" }, 500);
  }
});

app.post("/api/eventos", async (c) => {
  try {
    const {
      titulo,
      data,
      responsavel,
      status,
      local,
      curso,
      tipoEvento,
      modalidade,
      descricao,
      imagem,
      documento,
      link,
      odsAssociadas,
      anexos,
    } = await c.req.json();

    if (!titulo || !data || !responsavel || !status || !tipoEvento || !modalidade) {
      return c.json({ error: "Campos obrigatórios faltando" }, 400);
    }

    const evento = await prisma.evento.create({
      data: {
        titulo,
        data: new Date(data),
        responsavel,
        status,
        local: local || null,
        curso,
        tipoEvento,
        modalidade,
        descricao,
        imagem,
        documento,
        link: link || null,
        odsAssociadas: {
          create: (odsAssociadas || []).map((ods: number) => ({ odsNumero: ods })),
        },
        anexos: {
          create: (anexos || []).map((nome: string) => ({ nome })),
        },
      },
      include: { odsAssociadas: true, anexos: true },
    });

    return c.json(evento, 201);
  } catch (error) {
    return c.json({ error: "Erro ao criar evento" }, 500);
  }
});

app.put("/api/eventos/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const {
      titulo,
      data,
      responsavel,
      status,
      local,
      curso,
      tipoEvento,
      modalidade,
      descricao,
      imagem,
      documento,
      link,
      odsAssociadas,
      anexos,
    } = await c.req.json();

    await prisma.odsEvento.deleteMany({ where: { eventoId: parseInt(id) } });
    await prisma.anexoEvento.deleteMany({ where: { eventoId: parseInt(id) } });

    const evento = await prisma.evento.update({
      where: { id: parseInt(id) },
      data: {
        ...(titulo && { titulo }),
        ...(data && { data: new Date(data) }),
        ...(responsavel && { responsavel }),
        ...(status && { status }),
        ...(local !== undefined && { local: local || null }),
        ...(curso && { curso }),
        ...(tipoEvento && { tipoEvento }),
        ...(modalidade && { modalidade }),
        ...(descricao !== undefined && { descricao }),
        ...(imagem && { imagem }),
        ...(documento && { documento }),
        ...(link !== undefined && { link: link || null }),
        ...(odsAssociadas && {
          odsAssociadas: {
            create: odsAssociadas.map((ods: number) => ({ odsNumero: ods })),
          },
        }),
        ...(anexos && {
          anexos: {
            create: anexos.map((nome: string) => ({ nome })),
          },
        }),
      },
      include: { odsAssociadas: true, anexos: true },
    });

    return c.json(evento);
  } catch (error) {
    return c.json({ error: "Erro ao atualizar evento" }, 500);
  }
});

app.delete("/api/eventos/:id", async (c) => {
  try {
    const { id } = c.req.param();
    await prisma.evento.delete({ where: { id: parseInt(id) } });
    return c.json({ message: "Evento deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Erro ao deletar evento" }, 500);
  }
});

// Comentários endpoints
app.get("/api/eventos/:eventoId/comentarios", async (c) => {
  try {
    const { eventoId } = c.req.param();
    const comentarios = await prisma.comentario.findMany({
      where: { eventoId: parseInt(eventoId) },
      include: { autor: true },
      orderBy: { criadoEm: "desc" },
    });
    return c.json(comentarios);
  } catch (error) {
    return c.json({ error: "Erro ao buscar comentários" }, 500);
  }
});

app.post("/api/eventos/:eventoId/comentarios", async (c) => {
  try {
    const { eventoId } = c.req.param();
    const { conteudo, autorId } = await c.req.json();

    if (!conteudo || !autorId) {
      return c.json({ error: "Conteúdo e autor são obrigatórios" }, 400);
    }

    const comentario = await prisma.comentario.create({
      data: { conteudo, autorId, eventoId: parseInt(eventoId) },
      include: { autor: true },
    });

    return c.json(comentario, 201);
  } catch (error) {
    return c.json({ error: "Erro ao criar comentário" }, 500);
  }
});

app.put("/api/eventos/:eventoId/comentarios/:comentarioId", async (c) => {
  try {
    const { comentarioId } = c.req.param();
    const { conteudo } = await c.req.json();

    const comentario = await prisma.comentario.update({
      where: { id: parseInt(comentarioId) },
      data: { conteudo },
      include: { autor: true },
    });

    return c.json(comentario);
  } catch (error) {
    return c.json({ error: "Erro ao atualizar comentário" }, 500);
  }
});

app.delete("/api/eventos/:eventoId/comentarios/:comentarioId", async (c) => {
  try {
    const { comentarioId } = c.req.param();
    await prisma.comentario.delete({ where: { id: parseInt(comentarioId) } });
    return c.json({ message: "Comentário deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Erro ao deletar comentário" }, 500);
  }
});

// Professores endpoints
app.get("/api/professores", async (c) => {
  try {
    const professors = await prisma.professorCoordenador.findMany();
    return c.json(professors);
  } catch (error) {
    return c.json({ error: "Failed to fetch professors" }, 500);
  }
});

app.post("/api/professores", async (c) => {
  try {
    const { nome, email, senha, curso } = await c.req.json();
    if (!nome || !email || !senha || !curso) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const professor = await prisma.professorCoordenador.create({
      data: { nome, email, senha, curso },
    });
    return c.json(professor, 201);
  } catch (error) {
    return c.json({ error: "Failed to create professor" }, 500);
  }
});

app.get("/api/professores/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const professor = await prisma.professorCoordenador.findUnique({
      where: { id: parseInt(id) },
    });
    if (!professor) {
      return c.json({ error: "Professor not found" }, 404);
    }
    return c.json(professor);
  } catch (error) {
    return c.json({ error: "Failed to fetch professor" }, 500);
  }
});

export default app;
