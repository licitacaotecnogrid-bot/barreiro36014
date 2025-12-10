import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Status } from "@/data/mock";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEvents } from "@/hooks/use-events";
import EventoFeed from "@/components/EventoFeed";
import StatusSelector from "@/components/StatusSelector";
import { Grid3x3, Table as TableIcon, Trash2 } from "lucide-react";

function StatusBadge({ status, eventoId, editable }: { status: Status; eventoId: number; editable: boolean }) {
  return <StatusSelector eventoId={eventoId} currentStatus={status} editable={editable} />;
}

type ViewMode = "feed" | "table";

export default function Eventos() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { eventos: baseEventos, refetchEventos, deleteEvento } = useEvents();
  const isStudent = currentUser?.cargo === "Aluno";
  const [viewMode, setViewMode] = useState<ViewMode>("feed");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | Status>("");
  const [responsavel, setResponsavel] = useState("");
  const [data, setData] = useState("");

  const handleDelete = async (id: number, titulo: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${titulo}"?`)) {
      try {
        await deleteEvento(id);
        await refetchEventos();
      } catch (error) {
        alert("Erro ao deletar evento");
      }
    }
  };

  const eventos = useMemo(() => {
    return baseEventos.filter((e) =>
      (!q || e.titulo.toLowerCase().includes(q.toLowerCase())) &&
      (!status || e.status === status) &&
      (!responsavel || e.responsavel.toLowerCase().includes(responsavel.toLowerCase())) &&
      (!data || e.data === data)
    );
  }, [q, status, responsavel, data]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">{isStudent ? "Meus Eventos" : "Eventos"}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{isStudent ? "Eventos do seu curso" : "Gerencie os eventos acadêmicos"}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isStudent && (
            <button onClick={() => navigate("/eventos/novo")} className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:opacity-95">
              + Novo Evento
            </button>
          )}
          <div className="flex items-center border rounded-md bg-card">
            <button
              onClick={() => setViewMode("feed")}
              className={`p-2 transition-colors ${viewMode === "feed" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Visualização em grid"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 transition-colors ${viewMode === "table" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Visualização em tabela"
            >
              <TableIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg sm:rounded-xl border bg-card p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por título" className="rounded-md border px-2 sm:px-3 py-2 text-xs sm:text-sm bg-background" />
          <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="rounded-md border px-2 sm:px-3 py-2 text-xs sm:text-sm bg-background">
            <option value="">Todos os status</option>
            <option>Confirmado</option>
            <option>Pendente</option>
            <option>Cancelado</option>
          </select>
          <input value={responsavel} onChange={(e)=>setResponsavel(e.target.value)} placeholder="Responsável" className="rounded-md border px-2 sm:px-3 py-2 text-xs sm:text-sm bg-background" />
          <input type="date" value={data} onChange={(e)=>setData(e.target.value)} className="rounded-md border px-2 sm:px-3 py-2 text-xs sm:text-sm bg-background" />
        </div>
      </div>

      {viewMode === "feed" ? (
        <EventoFeed
          eventos={eventos}
          title=""
          showFilters={true}
          onEventoClick={(id) => navigate(`/eventos/${id}`)}
          showDelete={!isStudent}
          onEventoDeleted={() => refetchEventos()}
        />
      ) : (
        <>
          <div className="hidden sm:block overflow-auto rounded-lg sm:rounded-xl border">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-2 sm:p-3 font-medium">Título</th>
                  <th className="p-2 sm:p-3 font-medium">Data</th>
                  <th className="p-2 sm:p-3 font-medium">Responsável</th>
                  <th className="p-2 sm:p-3 font-medium">Status</th>
                  {!isStudent && <th className="p-2 sm:p-3 font-medium">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {eventos.map((e)=> (
                  <tr key={e.id} className="border-t hover:bg-secondary/50 cursor-pointer" onClick={() => navigate(`/eventos/${e.id}`)}>
                    <td className="p-2 sm:p-3">{e.titulo}</td>
                    <td className="p-2 sm:p-3">{new Date(e.data).toLocaleDateString()}</td>
                    <td className="p-2 sm:p-3">{e.responsavel}</td>
                    <td className="p-2 sm:p-3" onClick={(event) => event.stopPropagation()}><StatusBadge status={e.status} eventoId={e.id} editable={!isStudent} /></td>
                    {!isStudent && (
                      <td className="p-2 sm:p-3" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Link to={`/eventos/${e.id}/editar`} className="text-primary hover:underline text-xs sm:text-sm">Editar</Link>
                          <button
                            onClick={() => handleDelete(e.id, e.titulo)}
                            className="text-destructive hover:text-red-700 text-xs sm:text-sm flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-2">
            {eventos.map((e) => (
              <div key={e.id} className="rounded-lg border bg-card p-3 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => navigate(`/eventos/${e.id}`)}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2" onClick={(event) => event.stopPropagation()}>
                    <h3 className="font-medium text-sm truncate">{e.titulo}</h3>
                    <StatusBadge status={e.status} eventoId={e.id} editable={!isStudent} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Data:</strong> {new Date(e.data).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Responsável:</strong> {e.responsavel}
                  </p>
                  {!isStudent && (
                    <div className="flex gap-2 pt-2 border-t" onClick={(event) => event.stopPropagation()}>
                      <Link to={`/eventos/${e.id}/editar`} className="text-primary hover:underline text-xs font-medium">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(e.id, e.titulo)}
                        className="text-destructive hover:text-red-700 text-xs font-medium flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
