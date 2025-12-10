import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Status } from "@/data/mock";
import { getApiUrl } from "@/lib/api";

export interface OdsEvento {
  id: number;
  eventoId: number;
  odsNumero: number;
  criadoEm: string;
}

export interface AnexoEvento {
  id: number;
  eventoId: number;
  nome: string;
  criadoEm: string;
}

export interface Evento {
  id: number;
  titulo: string;
  data: string;
  responsavel: string;
  status: Status;
  local?: string | null;
  curso: string;
  tipoEvento: string;
  modalidade: string;
  descricao?: string | null;
  imagem?: string | null;
  documento?: string | null;
  link?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  odsAssociadas: OdsEvento[];
  anexos: AnexoEvento[];
}

interface EventsContextType {
  eventos: Evento[];
  loading: boolean;
  error: string | null;
  addEvento: (evento: Omit<Evento, "id" | "criadoEm" | "atualizadoEm">) => Promise<void>;
  updateEvento: (id: number, evento: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: number) => Promise<void>;
  refetchEventos: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(getApiUrl("/api/eventos"));
      if (!response.ok) throw new Error("Failed to fetch eventos");
      const data = await response.json();
      setEventos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar eventos");
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const addEvento = async (evento: Omit<Evento, "id" | "criadoEm" | "atualizadoEm">) => {
    try {
      const response = await fetch(getApiUrl("/api/eventos"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento),
      });
      if (!response.ok) throw new Error("Failed to create evento");
      await fetchEventos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar evento");
      throw err;
    }
  };

  const updateEvento = async (id: number, updates: Partial<Evento>) => {
    try {
      const response = await fetch(getApiUrl(`/api/eventos/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update evento");
      await fetchEventos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar evento");
      throw err;
    }
  };

  const deleteEvento = async (id: number) => {
    try {
      const response = await fetch(getApiUrl(`/api/eventos/${id}`), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete evento");
      await fetchEventos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar evento");
      throw err;
    }
  };

  return (
    <EventsContext.Provider value={{ eventos, loading, error, addEvento, updateEvento, deleteEvento, refetchEventos: fetchEventos }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within EventsProvider");
  }
  return context;
}
