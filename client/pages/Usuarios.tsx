import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usuarios } from "@/data/mock";
import { useCurrentUser } from "@/hooks/use-current-user";

const perms = ["Visualizar", "Criar", "Editar", "Excluir"] as const;

type Perm = typeof perms[number];

type Map = Record<number, Record<Perm, boolean>>;

export default function Usuarios() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser?.cargo === "Aluno") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const [map, setMap] = useState<Map>(() => {
    const initial: Map = {} as any;
    for (const u of usuarios) initial[u.id] = { Visualizar: true, Criar: false, Editar: false, Excluir: false };
    return initial;
  });

  const toggle = (id: number, p: Perm) =>
    setMap((m) => ({ ...m, [id]: { ...m[id], [p]: !m[id][p] } }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Usuários e Permissões</h2>
        <p className="text-sm text-muted-foreground">Gerencie professores e coordenadores</p>
      </div>
      <div className="overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="p-3 font-medium">Nome</th>
              <th className="p-3 font-medium">E-mail</th>
              <th className="p-3 font-medium">Cargo</th>
              {perms.map((p) => (
                <th key={p} className="p-3 font-medium">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.nome}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.cargo}</td>
                {perms.map((p) => (
                  <td key={p} className="p-3">
                    <input type="checkbox" className="size-4" checked={!!map[u.id]?.[p]} onChange={() => toggle(u.id, p)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
