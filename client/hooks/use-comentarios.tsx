import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export interface ComentarioEvento {
  id: number;
  eventoId: number;
  usuarioId: number | null;
  autor: string;
  conteudo: string;
  criadoEm: string;
  atualizadoEm: string;
  usuario?: {
    id: number;
    nome: string;
    email: string;
  };
}

interface ComentariosContextType {
  comentarios: ComentarioEvento[];
  loading: boolean;
  error: string | null;
  addComentario: (eventoId: number, autor: string, conteudo: string, usuarioId?: number) => Promise<void>;
  deleteComentario: (eventoId: number, comentarioId: number) => Promise<void>;
  refetchComentarios: (eventoId: number) => Promise<void>;
}

const ComentariosContext = createContext<ComentariosContextType | undefined>(undefined);

export function ComentariosProvider({ children }: { children: ReactNode }) {
  const [comentarios, setComentarios] = useState<ComentarioEvento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComentarios = async (eventoId: number) => {
    if (!eventoId || eventoId <= 0) {
      setComentarios([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(getApiUrl(`/api/eventos/${eventoId}/comentarios`), {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setComentarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
      // Silently fail - don't show error toast for background fetch
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  };

  const addComentario = async (eventoId: number, autor: string, conteudo: string, usuarioId?: number) => {
    if (!eventoId || eventoId <= 0) {
      throw new Error("ID do evento inválido");
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(getApiUrl(`/api/eventos/${eventoId}/comentarios`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autor, conteudo, usuarioId }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await fetchComentarios(eventoId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar comentário";
      console.error("Erro ao criar comentário:", err);
      setError(errorMessage);
      throw err;
    }
  };

  const deleteComentario = async (eventoId: number, comentarioId: number) => {
    if (!eventoId || eventoId <= 0) {
      throw new Error("ID do evento inválido");
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(getApiUrl(`/api/eventos/${eventoId}/comentarios/${comentarioId}`), {
        method: "DELETE",
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await fetchComentarios(eventoId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar comentário";
      console.error("Erro ao deletar comentário:", err);
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <ComentariosContext.Provider value={{ comentarios, loading, error, addComentario, deleteComentario, refetchComentarios: fetchComentarios }}>
      {children}
    </ComentariosContext.Provider>
  );
}

export function useComentarios() {
  const context = useContext(ComentariosContext);
  if (context === undefined) {
    throw new Error("useComentarios must be used within ComentariosProvider");
  }
  return context;
}
