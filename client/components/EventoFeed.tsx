import { Evento } from "@/hooks/use-events";
import EventoPost from "./EventoPost";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { odsData } from "@/data/ods";

interface EventoFeedProps {
  eventos: Evento[];
  title?: string;
  showFilters?: boolean;
  onEventoClick?: (id: number) => void;
  showDelete?: boolean;
  onEventoDeleted?: () => void;
}

type ViewMode = "grid" | "list";
type FilterODS = "all" | number;

export default function EventoFeed({
  eventos,
  title = "Feed de Eventos",
  showFilters = true,
  onEventoClick,
  showDelete = false,
  onEventoDeleted,
}: EventoFeedProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterODS, setFilterODS] = useState<FilterODS>("all");

  // Use all ODS from odsData (all 17 ODS)
  const allODS = odsData.map((ods) => ods.numero);

  // Filter eventos based on selected ODS
  const filteredEventos = eventos.filter((e) => {
    if (filterODS === "all") return true;
    const odsNumbers = (e.odsAssociadas || []).map((ods) =>
      typeof ods === "number" ? ods : ods.odsNumero
    );
    return odsNumbers.includes(filterODS as number);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold">{title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {filteredEventos.length} evento{filteredEventos.length !== 1 ? "s" : ""} encontrado
            {filteredEventos.length !== 1 ? "s" : ""}
          </p>
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 rounded-md border hover:bg-accent transition-colors"
              title={viewMode === "grid" ? "Mudar para visualização em lista" : "Mudar para visualização em grid"}
            >
              {viewMode === "grid" ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Filtro de ODS */}
      {showFilters && allODS.length > 0 && (
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            FILTRAR POR ODS
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterODS("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterODS === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Todos
            </button>
            {allODS.map((odsNum) => {
              const odsInfo = odsData.find((ods) => ods.numero === odsNum);
              return (
                <button
                  key={odsNum}
                  onClick={() => setFilterODS(odsNum)}
                  className={`w-8 h-8 rounded-full text-white text-xs font-bold transition-transform hover:scale-110 ${
                    filterODS === odsNum ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{
                    backgroundColor: odsInfo?.cor || "#999",
                    opacity: filterODS === odsNum ? 1 : 0.8,
                  }}
                  title={`${odsInfo?.titulo}`}
                >
                  {odsNum}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts */}
      {filteredEventos.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {filteredEventos.map((evento) => (
            <EventoPost
              key={evento.id}
              evento={evento}
              onClick={() => onEventoClick?.(evento.id)}
              showDelete={showDelete}
              onDelete={onEventoDeleted}
              editable={true}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="text-muted-foreground">Nenhum evento encontrado</p>
        </div>
      )}
    </div>
  );
}
