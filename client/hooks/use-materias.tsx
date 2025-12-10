import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import type { Materia } from "@/data/mock";
import { getApiUrl } from "@/lib/api";

interface MateriasContextType {
  materias: Materia[];
  loading: boolean;
  error: string | null;
  addMateria: (materia: Omit<Materia, "id">) => Promise<void>;
  updateMateria: (id: number, materia: Partial<Materia>) => Promise<void>;
  deleteMateria: (id: number) => Promise<void>;
  getMateriaById: (id: number) => Materia | undefined;
  refetchMaterias: () => Promise<void>;
}

const MateriasContext = createContext<MateriasContextType | undefined>(undefined);

export function MateriasProvider({ children }: { children: ReactNode }) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(getApiUrl("/api/materias"));
      if (!response.ok) throw new Error("Failed to fetch materias");
      const data = await response.json();
      setMaterias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar matérias");
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  const addMateria = async (materia: Omit<Materia, "id">) => {
    try {
      const response = await fetch(getApiUrl("/api/materias"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materia),
      });
      if (!response.ok) throw new Error("Failed to create materia");
      await fetchMaterias();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar matéria");
      throw err;
    }
  };

  const updateMateria = async (id: number, updates: Partial<Materia>) => {
    try {
      const response = await fetch(getApiUrl(`/api/materias/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update materia");
      await fetchMaterias();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar matéria");
      throw err;
    }
  };

  const deleteMateria = async (id: number) => {
    try {
      const response = await fetch(getApiUrl(`/api/materias/${id}`), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete materia");
      await fetchMaterias();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar matéria");
      throw err;
    }
  };

  const getMateriaById = (id: number) => {
    return materias.find((m) => m.id === id);
  };

  return (
    <MateriasContext.Provider
      value={{
        materias,
        loading,
        error,
        addMateria,
        updateMateria,
        deleteMateria,
        getMateriaById,
        refetchMaterias: fetchMaterias,
      }}
    >
      {children}
    </MateriasContext.Provider>
  );
}

export function useMaterias() {
  const context = useContext(MateriasContext);
  if (context === undefined) {
    throw new Error("useMaterias must be used within MateriasProvider");
  }
  return context;
}
