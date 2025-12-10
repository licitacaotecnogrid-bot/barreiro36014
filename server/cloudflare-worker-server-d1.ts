import { Hono } from "hono";
import { cors } from "hono/cors";
import { D1Database } from "@cloudflare/workers-types";
import { createD1Query } from "./d1-db";

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
    credentials: false,
  })
);

// Handle preflight requests explicitly
app.options("*", (c) => c.text("", 204));

// ============= USUARIOS ENDPOINTS =============

app.post("/api/login", async (c) => {
  try {
    const { email, senha } = await c.req.json();
    if (!email || !senha) {
      return c.json({ error: "Email e senha são obrigatórios" }, 400);
    }

    const db = createD1Query(c.env.DB);
    const usuario = await db.one(
      "SELECT id, nome, email, senha, cargo FROM usuario WHERE email = ?",
      [email]
    );

    if (!usuario) {
      return c.json({ error: "Usuário não encontrado" }, 401);
    }

    if (usuario.senha !== senha) {
      return c.json({ error: "Senha incorreta" }, 401);
    }

    return c.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Erro ao fazer login" }, 500);
  }
});

app.get("/api/usuarios", async (c) => {
  try {
    const db = createD1Query(c.env.DB);
    const usuarios = await db.all(
      "SELECT id, nome, email, cargo FROM usuario ORDER BY id"
    );
    return c.json(usuarios);
  } catch (error) {
    return c.json({ error: "Erro ao buscar usuários" }, 500);
  }
});

app.post("/api/usuarios", async (c) => {
  try {
    const { nome, email, senha, cargo } = await c.req.json();

    if (!nome || !email || !senha || !cargo) {
      return c.json({ error: "Todos os campos são obrigatórios" }, 400);
    }

    const db = createD1Query(c.env.DB);
    const existing = await db.one("SELECT id FROM usuario WHERE email = ?", [email]);

    if (existing) {
      return c.json({ error: "Email já cadastrado" }, 400);
    }

    const result = await db.run(
      "INSERT INTO usuario (nome, email, senha, cargo) VALUES (?, ?, ?, ?)",
      [nome, email, senha, cargo]
    );

    return c.json(
      {
        id: result.meta.last_row_id,
        nome,
        email,
        cargo,
      },
      201
    );
  } catch (error) {
    return c.json({ error: "Erro ao criar usuário" }, 500);
  }
});

app.put("/api/usuarios/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { nome, senha, cargo } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const updates: string[] = [];
    const params: any[] = [];

    if (nome) {
      updates.push("nome = ?");
      params.push(nome);
    }
    if (senha) {
      updates.push("senha = ?");
      params.push(senha);
    }
    if (cargo) {
      updates.push("cargo = ?");
      params.push(cargo);
    }

    if (updates.length === 0) {
      return c.json({ error: "Nenhum campo para atualizar" }, 400);
    }

    params.push(id);
    const sql = `UPDATE usuario SET ${updates.join(", ")}, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.run(sql, params);

    const usuario = await db.one(
      "SELECT id, nome, email, cargo FROM usuario WHERE id = ?",
      [id]
    );

    return c.json(usuario);
  } catch (error) {
    return c.json({ error: "Erro ao atualizar usuário" }, 500);
  }
});

app.delete("/api/usuarios/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM usuario WHERE id = ?", [id]);
    return c.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Erro ao deletar usuário" }, 500);
  }
});

// ============= EVENTOS ENDPOINTS =============

app.get("/api/eventos", async (c) => {
  try {
    const db = createD1Query(c.env.DB);
    const eventos = await db.all(
      "SELECT * FROM evento ORDER BY data DESC"
    );
    
    const eventosComDetalhes = await Promise.all(
      eventos.map(async (evento: any) => {
        const ods = await db.all(
          "SELECT ods_numero FROM ods_evento WHERE evento_id = ?",
          [evento.id]
        );
        const anexos = await db.all(
          "SELECT id, nome FROM anexo_evento WHERE evento_id = ?",
          [evento.id]
        );
        return {
          ...evento,
          odsAssociadas: ods,
          anexos: anexos,
        };
      })
    );

    return c.json(eventosComDetalhes);
  } catch (error) {
    return c.json({ error: "Erro ao buscar eventos" }, 500);
  }
});

app.get("/api/eventos/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    const evento = await db.one("SELECT * FROM evento WHERE id = ?", [id]);

    if (!evento) {
      return c.json({ error: "Evento não encontrado" }, 404);
    }

    const ods = await db.all(
      "SELECT ods_numero FROM ods_evento WHERE evento_id = ?",
      [id]
    );
    const anexos = await db.all(
      "SELECT id, nome FROM anexo_evento WHERE evento_id = ?",
      [id]
    );

    return c.json({
      ...evento,
      odsAssociadas: ods,
      anexos: anexos,
    });
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

    const db = createD1Query(c.env.DB);
    const result = await db.run(
      `INSERT INTO evento (titulo, data, responsavel, status, local, curso, tipo_evento, modalidade, descricao, imagem, documento, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        new Date(data).toISOString(),
        responsavel,
        status,
        local || null,
        curso,
        tipoEvento,
        modalidade,
        descricao || null,
        imagem || null,
        documento || null,
        link || null,
      ]
    );

    const eventoId = result.meta.last_row_id;

    if (odsAssociadas && odsAssociadas.length > 0) {
      for (const ods of odsAssociadas) {
        await db.run(
          "INSERT INTO ods_evento (evento_id, ods_numero) VALUES (?, ?)",
          [eventoId, ods]
        );
      }
    }

    if (anexos && anexos.length > 0) {
      for (const nome of anexos) {
        await db.run(
          "INSERT INTO anexo_evento (evento_id, nome) VALUES (?, ?)",
          [eventoId, nome]
        );
      }
    }

    const evento = await db.one("SELECT * FROM evento WHERE id = ?", [eventoId]);
    const odsData = await db.all(
      "SELECT ods_numero FROM ods_evento WHERE evento_id = ?",
      [eventoId]
    );
    const anexosData = await db.all(
      "SELECT id, nome FROM anexo_evento WHERE evento_id = ?",
      [eventoId]
    );

    return c.json(
      {
        ...evento,
        odsAssociadas: odsData,
        anexos: anexosData,
      },
      201
    );
  } catch (error) {
    return c.json({ error: "Erro ao criar evento" }, 500);
  }
});

app.put("/api/eventos/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
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

    const db = createD1Query(c.env.DB);
    const updates: string[] = [];
    const params: any[] = [];

    if (titulo) {
      updates.push("titulo = ?");
      params.push(titulo);
    }
    if (data) {
      updates.push("data = ?");
      params.push(new Date(data).toISOString());
    }
    if (responsavel) {
      updates.push("responsavel = ?");
      params.push(responsavel);
    }
    if (status) {
      updates.push("status = ?");
      params.push(status);
    }
    if (local !== undefined) {
      updates.push("local = ?");
      params.push(local || null);
    }
    if (curso) {
      updates.push("curso = ?");
      params.push(curso);
    }
    if (tipoEvento) {
      updates.push("tipo_evento = ?");
      params.push(tipoEvento);
    }
    if (modalidade) {
      updates.push("modalidade = ?");
      params.push(modalidade);
    }
    if (descricao !== undefined) {
      updates.push("descricao = ?");
      params.push(descricao || null);
    }
    if (imagem) {
      updates.push("imagem = ?");
      params.push(imagem);
    }
    if (documento) {
      updates.push("documento = ?");
      params.push(documento);
    }
    if (link !== undefined) {
      updates.push("link = ?");
      params.push(link || null);
    }

    if (updates.length > 0) {
      params.push(id);
      const sql = `UPDATE evento SET ${updates.join(", ")}, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`;
      await db.run(sql, params);
    }

    if (odsAssociadas) {
      await db.run("DELETE FROM ods_evento WHERE evento_id = ?", [id]);
      for (const ods of odsAssociadas) {
        await db.run(
          "INSERT INTO ods_evento (evento_id, ods_numero) VALUES (?, ?)",
          [id, ods]
        );
      }
    }

    if (anexos) {
      await db.run("DELETE FROM anexo_evento WHERE evento_id = ?", [id]);
      for (const nome of anexos) {
        await db.run(
          "INSERT INTO anexo_evento (evento_id, nome) VALUES (?, ?)",
          [id, nome]
        );
      }
    }

    const evento = await db.one("SELECT * FROM evento WHERE id = ?", [id]);
    const odsData = await db.all(
      "SELECT ods_numero FROM ods_evento WHERE evento_id = ?",
      [id]
    );
    const anexosData = await db.all(
      "SELECT id, nome FROM anexo_evento WHERE evento_id = ?",
      [id]
    );

    return c.json({
      ...evento,
      odsAssociadas: odsData,
      anexos: anexosData,
    });
  } catch (error) {
    return c.json({ error: "Erro ao atualizar evento" }, 500);
  }
});

app.delete("/api/eventos/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM evento WHERE id = ?", [id]);
    return c.json({ message: "Evento deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Erro ao deletar evento" }, 500);
  }
});

// ============= COMENTÁRIOS ENDPOINTS =============

app.get("/api/eventos/:eventoId/comentarios", async (c) => {
  try {
    const eventoId = parseInt(c.req.param("eventoId"));
    const db = createD1Query(c.env.DB);
    const comentarios = await db.all(
      "SELECT * FROM comentario_evento WHERE evento_id = ? ORDER BY criado_em DESC",
      [eventoId]
    );
    return c.json(comentarios);
  } catch (error) {
    return c.json({ error: "Erro ao buscar comentários" }, 500);
  }
});

app.post("/api/eventos/:eventoId/comentarios", async (c) => {
  try {
    const eventoId = parseInt(c.req.param("eventoId"));
    const { conteudo, autor, usuarioId } = await c.req.json();

    if (!conteudo || !autor) {
      return c.json({ error: "Conteúdo e autor são obrigatórios" }, 400);
    }

    const db = createD1Query(c.env.DB);
    const result = await db.run(
      "INSERT INTO comentario_evento (evento_id, usuario_id, autor, conteudo) VALUES (?, ?, ?, ?)",
      [eventoId, usuarioId || null, autor, conteudo]
    );

    const comentario = await db.one(
      "SELECT * FROM comentario_evento WHERE id = ?",
      [result.meta.last_row_id]
    );

    return c.json(comentario, 201);
  } catch (error) {
    return c.json({ error: "Erro ao criar comentário" }, 500);
  }
});

app.put("/api/eventos/:eventoId/comentarios/:comentarioId", async (c) => {
  try {
    const comentarioId = parseInt(c.req.param("comentarioId"));
    const { conteudo } = await c.req.json();

    const db = createD1Query(c.env.DB);
    await db.run(
      "UPDATE comentario_evento SET conteudo = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?",
      [conteudo, comentarioId]
    );

    const comentario = await db.one(
      "SELECT * FROM comentario_evento WHERE id = ?",
      [comentarioId]
    );

    return c.json(comentario);
  } catch (error) {
    return c.json({ error: "Erro ao atualizar comentário" }, 500);
  }
});

app.delete("/api/eventos/:eventoId/comentarios/:comentarioId", async (c) => {
  try {
    const comentarioId = parseInt(c.req.param("comentarioId"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM comentario_evento WHERE id = ?", [comentarioId]);
    return c.json({ message: "Comentário deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Erro ao deletar comentário" }, 500);
  }
});

// ============= PROFESSORES ENDPOINTS =============

app.get("/api/professores", async (c) => {
  try {
    const db = createD1Query(c.env.DB);
    const professors = await db.all("SELECT * FROM professor_coordenador ORDER BY id");
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

    const db = createD1Query(c.env.DB);
    const existing = await db.one(
      "SELECT id FROM professor_coordenador WHERE email = ?",
      [email]
    );

    if (existing) {
      return c.json({ error: "Email já cadastrado" }, 400);
    }

    const result = await db.run(
      "INSERT INTO professor_coordenador (nome, email, senha, curso) VALUES (?, ?, ?, ?)",
      [nome, email, senha, curso]
    );

    return c.json(
      {
        id: result.meta.last_row_id,
        nome,
        email,
        senha,
        curso,
      },
      201
    );
  } catch (error) {
    return c.json({ error: "Failed to create professor" }, 500);
  }
});

app.get("/api/professores/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    const professor = await db.one(
      "SELECT * FROM professor_coordenador WHERE id = ?",
      [id]
    );

    if (!professor) {
      return c.json({ error: "Professor not found" }, 404);
    }

    return c.json(professor);
  } catch (error) {
    return c.json({ error: "Failed to fetch professor" }, 500);
  }
});

app.put("/api/professores/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { nome, email, senha, curso } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const updates: string[] = [];
    const params: any[] = [];

    if (nome) {
      updates.push("nome = ?");
      params.push(nome);
    }
    if (email) {
      updates.push("email = ?");
      params.push(email);
    }
    if (senha) {
      updates.push("senha = ?");
      params.push(senha);
    }
    if (curso) {
      updates.push("curso = ?");
      params.push(curso);
    }

    if (updates.length === 0) {
      return c.json({ error: "Nenhum campo para atualizar" }, 400);
    }

    params.push(id);
    const sql = `UPDATE professor_coordenador SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.run(sql, params);

    const professor = await db.one(
      "SELECT * FROM professor_coordenador WHERE id = ?",
      [id]
    );

    return c.json(professor);
  } catch (error) {
    return c.json({ error: "Failed to update professor" }, 500);
  }
});

app.delete("/api/professores/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM professor_coordenador WHERE id = ?", [id]);
    return c.json({ message: "Professor deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Failed to delete professor" }, 500);
  }
});

// ============= PROJETOS PESQUISA ENDPOINTS =============

app.get("/api/projetos-pesquisa", async (c) => {
  try {
    const db = createD1Query(c.env.DB);
    const projetos = await db.all(
      "SELECT * FROM projeto_pesquisa ORDER BY created_at DESC"
    );
    return c.json(projetos);
  } catch (error) {
    return c.json({ error: "Failed to fetch research projects" }, 500);
  }
});

app.post("/api/projetos-pesquisa", async (c) => {
  try {
    const {
      titulo,
      areaTemática,
      descricao,
      momentoOcorre,
      problemaPesquisa,
      metodologia,
      resultadosEsperados,
      imagem,
      professorCoordenadorId,
    } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const result = await db.run(
      `INSERT INTO projeto_pesquisa (titulo, area_tematica, descricao, momento_ocorre, problema_pesquisa, metodologia, resultados_esperados, imagem, professor_coordenador_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        areaTemática,
        descricao,
        new Date(momentoOcorre).toISOString(),
        problemaPesquisa,
        metodologia,
        resultadosEsperados,
        imagem || null,
        professorCoordenadorId,
      ]
    );

    const projeto = await db.one(
      "SELECT * FROM projeto_pesquisa WHERE id = ?",
      [result.meta.last_row_id]
    );

    return c.json(projeto, 201);
  } catch (error) {
    return c.json({ error: "Failed to create research project" }, 500);
  }
});

app.get("/api/projetos-pesquisa/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    const projeto = await db.one(
      "SELECT * FROM projeto_pesquisa WHERE id = ?",
      [id]
    );

    if (!projeto) {
      return c.json({ error: "Projeto de pesquisa not found" }, 404);
    }

    return c.json(projeto);
  } catch (error) {
    return c.json({ error: "Failed to fetch research project" }, 500);
  }
});

app.put("/api/projetos-pesquisa/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const {
      titulo,
      areaTemática,
      descricao,
      momentoOcorre,
      problemaPesquisa,
      metodologia,
      resultadosEsperados,
      imagem,
    } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const updates: string[] = [];
    const params: any[] = [];

    if (titulo) {
      updates.push("titulo = ?");
      params.push(titulo);
    }
    if (areaTemática) {
      updates.push("area_tematica = ?");
      params.push(areaTemática);
    }
    if (descricao) {
      updates.push("descricao = ?");
      params.push(descricao);
    }
    if (momentoOcorre) {
      updates.push("momento_ocorre = ?");
      params.push(new Date(momentoOcorre).toISOString());
    }
    if (problemaPesquisa) {
      updates.push("problema_pesquisa = ?");
      params.push(problemaPesquisa);
    }
    if (metodologia) {
      updates.push("metodologia = ?");
      params.push(metodologia);
    }
    if (resultadosEsperados) {
      updates.push("resultados_esperados = ?");
      params.push(resultadosEsperados);
    }
    if (imagem) {
      updates.push("imagem = ?");
      params.push(imagem);
    }

    if (updates.length === 0) {
      return c.json({ error: "Nenhum campo para atualizar" }, 400);
    }

    params.push(id);
    const sql = `UPDATE projeto_pesquisa SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.run(sql, params);

    const projeto = await db.one(
      "SELECT * FROM projeto_pesquisa WHERE id = ?",
      [id]
    );

    return c.json(projeto);
  } catch (error) {
    return c.json({ error: "Failed to update research project" }, 500);
  }
});

app.delete("/api/projetos-pesquisa/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM projeto_pesquisa WHERE id = ?", [id]);
    return c.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Failed to delete research project" }, 500);
  }
});

// ============= PROJETOS EXTENSÃO ENDPOINTS =============

app.get("/api/projetos-extensao", async (c) => {
  try {
    const db = createD1Query(c.env.DB);
    const projetos = await db.all(
      "SELECT * FROM projeto_extensao ORDER BY created_at DESC"
    );
    return c.json(projetos);
  } catch (error) {
    return c.json({ error: "Failed to fetch extension projects" }, 500);
  }
});

app.post("/api/projetos-extensao", async (c) => {
  try {
    const {
      titulo,
      areaTemática,
      descricao,
      momentoOcorre,
      tipoPessoasProcuram,
      comunidadeEnvolvida,
      imagem,
      professorCoordenadorId,
    } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const result = await db.run(
      `INSERT INTO projeto_extensao (titulo, area_tematica, descricao, momento_ocorre, tipo_pessoas_procuram, comunidade_envolvida, imagem, professor_coordenador_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        areaTemática,
        descricao,
        new Date(momentoOcorre).toISOString(),
        tipoPessoasProcuram,
        comunidadeEnvolvida,
        imagem || null,
        professorCoordenadorId,
      ]
    );

    const projeto = await db.one(
      "SELECT * FROM projeto_extensao WHERE id = ?",
      [result.meta.last_row_id]
    );

    return c.json(projeto, 201);
  } catch (error) {
    return c.json({ error: "Failed to create extension project" }, 500);
  }
});

app.get("/api/projetos-extensao/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    const projeto = await db.one(
      "SELECT * FROM projeto_extensao WHERE id = ?",
      [id]
    );

    if (!projeto) {
      return c.json({ error: "Projeto de extensão not found" }, 404);
    }

    return c.json(projeto);
  } catch (error) {
    return c.json({ error: "Failed to fetch extension project" }, 500);
  }
});

app.put("/api/projetos-extensao/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const {
      titulo,
      areaTemática,
      descricao,
      momentoOcorre,
      tipoPessoasProcuram,
      comunidadeEnvolvida,
      imagem,
    } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const updates: string[] = [];
    const params: any[] = [];

    if (titulo) {
      updates.push("titulo = ?");
      params.push(titulo);
    }
    if (areaTemática) {
      updates.push("area_tematica = ?");
      params.push(areaTemática);
    }
    if (descricao) {
      updates.push("descricao = ?");
      params.push(descricao);
    }
    if (momentoOcorre) {
      updates.push("momento_ocorre = ?");
      params.push(new Date(momentoOcorre).toISOString());
    }
    if (tipoPessoasProcuram) {
      updates.push("tipo_pessoas_procuram = ?");
      params.push(tipoPessoasProcuram);
    }
    if (comunidadeEnvolvida) {
      updates.push("comunidade_envolvida = ?");
      params.push(comunidadeEnvolvida);
    }
    if (imagem) {
      updates.push("imagem = ?");
      params.push(imagem);
    }

    if (updates.length === 0) {
      return c.json({ error: "Nenhum campo para atualizar" }, 400);
    }

    params.push(id);
    const sql = `UPDATE projeto_extensao SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.run(sql, params);

    const projeto = await db.one(
      "SELECT * FROM projeto_extensao WHERE id = ?",
      [id]
    );

    return c.json(projeto);
  } catch (error) {
    return c.json({ error: "Failed to update extension project" }, 500);
  }
});

app.delete("/api/projetos-extensao/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM projeto_extensao WHERE id = ?", [id]);
    return c.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    return c.json({ error: "Failed to delete extension project" }, 500);
  }
});

// ============= MATERIAS ENDPOINTS =============

app.get("/api/materias", async (c) => {
  try {
    const db = createD1Query(c.env.DB);
    const materias = await db.all("SELECT * FROM materia ORDER BY id");
    return c.json(materias);
  } catch (error) {
    return c.json({ error: "Failed to fetch subjects" }, 500);
  }
});

app.post("/api/materias", async (c) => {
  try {
    const { nome, descricao } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const existing = await db.one(
      "SELECT id FROM materia WHERE nome = ?",
      [nome]
    );

    if (existing) {
      return c.json({ error: "Matéria com esse nome já existe" }, 400);
    }

    const result = await db.run(
      "INSERT INTO materia (nome, descricao) VALUES (?, ?)",
      [nome, descricao]
    );

    return c.json(
      {
        id: result.meta.last_row_id,
        nome,
        descricao,
      },
      201
    );
  } catch (error) {
    return c.json({ error: "Failed to create subject" }, 500);
  }
});

app.get("/api/materias/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    const materia = await db.one(
      "SELECT * FROM materia WHERE id = ?",
      [id]
    );

    if (!materia) {
      return c.json({ error: "Materia not found" }, 404);
    }

    return c.json(materia);
  } catch (error) {
    return c.json({ error: "Failed to fetch subject" }, 500);
  }
});

app.put("/api/materias/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { nome, descricao } = await c.req.json();

    const db = createD1Query(c.env.DB);
    const updates: string[] = [];
    const params: any[] = [];

    if (nome) {
      updates.push("nome = ?");
      params.push(nome);
    }
    if (descricao) {
      updates.push("descricao = ?");
      params.push(descricao);
    }

    if (updates.length === 0) {
      return c.json({ error: "Nenhum campo para atualizar" }, 400);
    }

    params.push(id);
    const sql = `UPDATE materia SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.run(sql, params);

    const materia = await db.one(
      "SELECT * FROM materia WHERE id = ?",
      [id]
    );

    return c.json(materia);
  } catch (error) {
    return c.json({ error: "Failed to update subject" }, 500);
  }
});

app.delete("/api/materias/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = createD1Query(c.env.DB);
    await db.run("DELETE FROM materia WHERE id = ?", [id]);
    return c.json({ message: "Matéria deletada com sucesso" });
  } catch (error) {
    return c.json({ error: "Failed to delete subject" }, 500);
  }
});

// Health check
app.get("/api/ping", (c) => {
  return c.json({ message: "pong" });
});

app.get("/api/demo", (c) => {
  return c.json({ message: "Demo endpoint working" });
});

export default app;
