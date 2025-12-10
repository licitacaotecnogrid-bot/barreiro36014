import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export interface ProjetoPesquisa {
  id: number;
  titulo: string;
  areaTematica: string;
  descricao: string;
  momentoOcorre: string;
  problemaPesquisa: string;
  metodologia: string;
  resultadosEsperados: string;
  imagem?: string | null;
  professorCoordenadorId: number;
}

export interface ProjetoExtensao {
  id: number;
  titulo: string;
  areaTematica: string;
  descricao: string;
  momentoOcorre: string;
  tipoPessoasProcuram: string;
  comunidadeEnvolvida: string;
  imagem?: string | null;
  professorCoordenadorId: number;
}

interface ProjetosContextType {
  projetosPesquisa: ProjetoPesquisa[];
  projetosExtensao: ProjetoExtensao[];
  loading: boolean;
  error: string | null;
  addProjetoPesquisa: (projeto: Omit<ProjetoPesquisa, "id">) => Promise<void>;
  updateProjetoPesquisa: (id: number, projeto: Partial<ProjetoPesquisa>) => Promise<void>;
  deleteProjetoPesquisa: (id: number) => Promise<void>;
  addProjetoExtensao: (projeto: Omit<ProjetoExtensao, "id">) => Promise<void>;
  updateProjetoExtensao: (id: number, projeto: Partial<ProjetoExtensao>) => Promise<void>;
  deleteProjetoExtensao: (id: number) => Promise<void>;
  getProjetoPesquisaById: (id: number) => ProjetoPesquisa | undefined;
  getProjetoExtensaoById: (id: number) => ProjetoExtensao | undefined;
  getProjetosPesquisaByProfessor: (professorId: number) => ProjetoPesquisa[];
  getProjetosExtensaoByProfessor: (professorId: number) => ProjetoExtensao[];
  refetchProjetos: () => Promise<void>;
}

const ProjetosContext = createContext<ProjetosContextType | undefined>(undefined);

export function ProjetosProvider({ children }: { children: ReactNode }) {
  const [projetosPesquisa, setProjetosPesquisa] = useState<ProjetoPesquisa[]>([]);
  const [projetosExtensao, setProjetosExtensao] = useState<ProjetoExtensao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjetos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pesquisaRes, extensaoRes] = await Promise.all([
        fetch(getApiUrl("/api/projetos-pesquisa")),
        fetch(getApiUrl("/api/projetos-extensao")),
      ]);

      if (!pesquisaRes.ok || !extensaoRes.ok) throw new Error("Failed to fetch projetos");

      const pesquisaData = await pesquisaRes.json();
      const extensaoData = await extensaoRes.json();

      setProjetosPesquisa(pesquisaData);
      setProjetosExtensao(extensaoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar projetos");
      setProjetosPesquisa([]);
      setProjetosExtensao([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, []);

  const addProjetoPesquisa = async (projeto: Omit<ProjetoPesquisa, "id">) => {
    try {
      const response = await fetch(getApiUrl("/api/projetos-pesquisa"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projeto),
      });
      if (!response.ok) throw new Error("Failed to create projeto");
      await fetchProjetos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar projeto");
      throw err;
    }
  };

  const updateProjetoPesquisa = async (id: number, updates: Partial<ProjetoPesquisa>) => {
    try {
      const response = await fetch(getApiUrl(`/api/projetos-pesquisa/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update projeto");
      await fetchProjetos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar projeto");
      throw err;
    }
  };

  const deleteProjetoPesquisa = async (id: number) => {
    try {
      const response = await fetch(getApiUrl(`/api/projetos-pesquisa/${id}`), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete projeto");
      await fetchProjetos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar projeto");
      throw err;
    }
  };

  const addProjetoExtensao = async (projeto: Omit<ProjetoExtensao, "id">) => {
    try {
      const response = await fetch(getApiUrl("/api/projetos-extensao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projeto),
      });
      if (!response.ok) throw new Error("Failed to create projeto");
      await fetchProjetos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar projeto");
      throw err;
    }
  };

  const updateProjetoExtensao = async (id: number, updates: Partial<ProjetoExtensao>) => {
    try {
      const response = await fetch(getApiUrl(`/api/projetos-extensao/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update projeto");
      await fetchProjetos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar projeto");
      throw err;
    }
  };

  const deleteProjetoExtensao = async (id: number) => {
    try {
      const response = await fetch(getApiUrl(`/api/projetos-extensao/${id}`), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete projeto");
      await fetchProjetos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar projeto");
      throw err;
    }
  };

  const getProjetoPesquisaById = (id: number) => {
    return projetosPesquisa.find((p) => p.id === id);
  };

  const getProjetoExtensaoById = (id: number) => {
    return projetosExtensao.find((p) => p.id === id);
  };

  const getProjetosPesquisaByProfessor = (professorId: number) => {
    return projetosPesquisa.filter((p) => p.professorCoordenadorId === professorId);
  };

  const getProjetosExtensaoByProfessor = (professorId: number) => {
    return projetosExtensao.filter((p) => p.professorCoordenadorId === professorId);
  };

  return (
    <ProjetosContext.Provider
      value={{
        projetosPesquisa,
        projetosExtensao,
        loading,
        error,
        addProjetoPesquisa,
        updateProjetoPesquisa,
        deleteProjetoPesquisa,
        addProjetoExtensao,
        updateProjetoExtensao,
        deleteProjetoExtensao,
        getProjetoPesquisaById,
        getProjetoExtensaoById,
        getProjetosPesquisaByProfessor,
        getProjetosExtensaoByProfessor,
        refetchProjetos: fetchProjetos,
      }}
    >
      {children}
    </ProjetosContext.Provider>
  );
}

export function useProjetos() {
  const context = useContext(ProjetosContext);
  if (context === undefined) {
    throw new Error("useProjetos must be used within ProjetosProvider");
  }
  return context;
}
