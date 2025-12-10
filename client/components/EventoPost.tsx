import { Heart, Share2, MessageCircle, ExternalLink, Trash2 } from "lucide-react";
import { Evento, useEvents } from "@/hooks/use-events";
import { getODSByIds } from "@/data/ods";
import { useState } from "react";
import { cn } from "@/lib/utils";
import StatusSelector from "@/components/StatusSelector";
import { useCurrentUser } from "@/hooks/use-current-user";

interface EventoPostProps {
  evento: Evento;
  onClick?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  editable?: boolean;
}

export default function EventoPost({ evento, onClick, onDelete, showDelete = false, editable = true }: EventoPostProps) {
  const [liked, setLiked] = useState(false);
  const { deleteEvento } = useEvents();
  const { currentUser } = useCurrentUser();

  const odsNumbers = evento.odsAssociadas
    ? evento.odsAssociadas.map((ods) =>
        typeof ods === "number" ? ods : ods.odsNumero
      )
    : [];
  const ods = odsNumbers.length > 0 ? getODSByIds(odsNumbers) : [];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/eventos/${evento.id}`;
    const text = `Confira este evento: ${evento.titulo}`;
    if (navigator.share) {
      navigator.share({ title: evento.titulo, text, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado!");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o evento "${evento.titulo}"?`)) {
      try {
        await deleteEvento(evento.id);
        onDelete?.();
      } catch (error) {
        alert("Erro ao deletar evento");
      }
    }
  };

  return (
    <div
      onClick={onClick}
      className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Imagem do Evento */}
      {evento.imagem ? (
        <div className="w-full h-64 bg-secondary overflow-hidden">
          <img
            src={evento.imagem}
            alt={evento.titulo}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-sm text-muted-foreground">{evento.tipoEvento}</p>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{evento.titulo}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(evento.data).toLocaleDateString("pt-BR", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <StatusSelector
              eventoId={evento.id}
              currentStatus={evento.status}
              editable={editable && currentUser?.cargo !== "Aluno"}
            />
          </div>
        </div>

        {/* Descrição */}
        {evento.descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {evento.descricao}
          </p>
        )}

        {/* ODS */}
        {ods.length > 0 && (
          <div className="mb-4 pb-4 border-b">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              ODS ASSOCIADAS
            </p>
            <div className="flex flex-wrap gap-2">
              {ods.map((od) => (
                <div key={od.id} className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: od.cor }}
                    title={od.titulo}
                  >
                    {od.numero}
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {od.titulo.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div>
            <p className="text-muted-foreground">Modalidade</p>
            <p className="font-medium">{evento.modalidade || "Presencial"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">
              {evento.modalidade === "Online" ? "Tipo" : "Local"}
            </p>
            <p className="font-medium truncate">
              {evento.modalidade === "Online"
                ? evento.link ? "Online" : "A Definir"
                : evento.local || "A Definir"
              }
            </p>
          </div>
        </div>

        {/* Link de Acesso */}
        {evento.link && (evento.modalidade === "Online" || evento.modalidade === "Híbrido") && (
          <div className="mb-4 pt-3 border-t">
            <a
              href={evento.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={16} /> Acessar Evento
            </a>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-3 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart
              size={18}
              className={liked ? "fill-current text-red-500" : ""}
            />
            <span className="text-xs sm:inline hidden">Curtir</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-xs sm:inline hidden">Comentar</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 size={18} />
            <span className="text-xs sm:inline hidden">Compartilhar</span>
          </button>
          {showDelete && (
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={18} />
              <span className="text-xs sm:inline hidden">Excluir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
