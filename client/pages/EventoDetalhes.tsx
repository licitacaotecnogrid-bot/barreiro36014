import { useParams, useNavigate, Link } from "react-router-dom";
import { useEvents } from "@/hooks/use-events";
import { useComentarios } from "@/hooks/use-comentarios";
import { getODSByIds } from "@/data/ods";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect } from "react";
import {
  Calendar,
  MapPin,
  User,
  Share2,
  Heart,
  MessageCircle,
  ArrowLeft,
  Edit,
  FileText,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function EventoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { eventos } = useEvents();
  const { currentUser } = useCurrentUser();
  const { comentarios, addComentario, deleteComentario, refetchComentarios, loading: loadingComentarios } = useComentarios();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const evento = eventos.find((e) => e.id === parseInt(id!));

  useEffect(() => {
    if (evento) {
      refetchComentarios(evento.id);
    }
  }, [evento?.id]);

  if (!evento) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">Evento não encontrado</p>
        </div>
      </div>
    );
  }

  const odsNumbers = evento.odsAssociadas
    ? evento.odsAssociadas.map((ods) =>
        typeof ods === "number" ? ods : ods.odsNumero
      )
    : [];
  const ods = odsNumbers.length > 0 ? getODSByIds(odsNumbers) : [];
  const isEditable = currentUser?.cargo !== "Aluno";

  const handleShare = async () => {
    const url = `${window.location.origin}/eventos/${evento.id}`;
    const text = `Confira este evento: ${evento.titulo}`;

    const copyToClipboardFallback = () => {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return true;
      } catch (err) {
        document.body.removeChild(textarea);
        return false;
      }
    };

    try {
      // Try using the Web Share API first
      if (navigator.share) {
        try {
          await navigator.share({ title: evento.titulo, text, url });
          toast.success("Evento compartilhado com sucesso!");
          return;
        } catch (shareError) {
          if (shareError instanceof Error && shareError.name === "AbortError") {
            return;
          }
          // Fall back to clipboard if share API fails
        }
      }

      // Try clipboard API
      let clipboardSucceeded = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          clipboardSucceeded = true;
        } catch (clipboardError) {
          // Clipboard API failed, will try fallback
          console.log("Clipboard API failed, trying fallback");
        }
      }

      // If clipboard API didn't work, use execCommand fallback
      if (!clipboardSucceeded) {
        const fallbackSucceeded = copyToClipboardFallback();
        if (!fallbackSucceeded) {
          toast.error("Erro ao copiar link");
          return;
        }
      }

      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast.error("Erro ao copiar link");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("Por favor, escreva um comentário");
      return;
    }

    setIsSubmittingComment(true);

    try {
      await addComentario(evento.id, currentUser?.nome || "Anônimo", commentText, currentUser?.id);
      setCommentText("");
      toast.success("Comentário adicionado!");
    } catch (error) {
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = (comentarioId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      try {
        deleteComentario(evento.id, comentarioId);
        toast.success("Comentário excluído");
      } catch (error) {
        toast.error("Erro ao excluir comentário");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Voltar</span>
        </button>
        {isEditable && (
          <Link
            to={`/eventos/${evento.id}/editar`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-95 transition-opacity text-sm"
          >
            <Edit size={16} />
            Editar
          </Link>
        )}
      </div>

      {/* Imagem Principal */}
      {evento.imagem ? (
        <div className="w-full h-96 rounded-lg overflow-hidden border">
          <img
            src={evento.imagem}
            alt={evento.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-96 rounded-lg overflow-hidden border bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-lg text-muted-foreground">{evento.tipoEvento}</p>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título e Status */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl sm:text-4xl font-bold">{evento.titulo}</h1>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap",
                  evento.status === "Confirmado" &&
                    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                  evento.status === "Pendente" &&
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                  evento.status === "Cancelado" &&
                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                )}
              >
                {evento.status}
              </span>
            </div>
            {evento.descricao && (
              <p className="text-lg text-muted-foreground">{evento.descricao}</p>
            )}
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Data do Evento</p>
                <p className="font-semibold">
                  {new Date(evento.data).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Modalidade</p>
                <p className="font-semibold">{evento.modalidade}</p>
              </div>
            </div>

            {evento.local && (evento.modalidade === "Presencial" || evento.modalidade === "Híbrido") && (
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-semibold">{evento.local}</p>
                </div>
              </div>
            )}

            {evento.link && (evento.modalidade === "Online" || evento.modalidade === "Híbrido") && (
              <div className="flex items-start gap-3">
                <LinkIcon size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Link de Acesso</p>
                  <a
                    href={evento.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline truncate"
                  >
                    Acessar
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Responsável</p>
                <p className="font-semibold">{evento.responsavel}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Evento</p>
                <p className="font-semibold">{evento.tipoEvento}</p>
              </div>
            </div>
          </div>

          {/* ODS Detalhadas */}
          {ods.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-bold mb-4">ODS Associados</h2>
              <div className="space-y-4">
                {ods.map((od) => (
                  <div
                    key={od.id}
                    className="flex items-start gap-4 pb-4 border-b last:pb-0 last:border-b-0"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: od.cor }}
                    >
                      {od.numero}
                    </div>
                    <div>
                      <h3 className="font-semibold">{od.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {od.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links e Documentos */}
          {(evento.link || evento.documento) && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-bold mb-4">Recursos</h2>
              <div className="space-y-3">
                {evento.link && (evento.modalidade === "Online" || evento.modalidade === "Híbrido") && (
                  <a
                    href={evento.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    <LinkIcon size={18} />
                    Acessar Evento Online
                  </a>
                )}
                {evento.documento && (
                  <a
                    href={evento.documento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-md bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    <FileText size={18} />
                    Download - Documento Relacionado
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Ações Sociais */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <button
              onClick={() => setLiked(!liked)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md border hover:bg-accent transition-colors"
            >
              <Heart
                size={20}
                className={liked ? "fill-current text-red-500" : ""}
              />
              <span className="font-medium">
                {liked ? "Descurtido" : "Curtir"}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md border hover:bg-accent transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-medium">Comentar</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md border hover:bg-accent transition-colors"
            >
              <Share2 size={20} />
              <span className="font-medium">Compartilhar</span>
            </button>
          </div>

          {/* Informações Adicionais */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                CURSO
              </p>
              <p className="text-sm font-medium">{evento.curso}</p>
            </div>

            {evento.anexos && evento.anexos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  ANEXOS ({evento.anexos.length})
                </p>
                <div className="space-y-1 mt-2">
                  {evento.anexos.map((anexo) => (
                    <p key={anexo.id} className="text-xs text-muted-foreground truncate">
                      📎 {anexo.nome}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Comentários */}
      {showComments && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Comentários ({comentarios.length})</h2>

          {/* Formulário de novo comentário */}
          {currentUser && (
            <div className="mb-6 pb-6 border-b">
              <div className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-20"
                  disabled={isSubmittingComment}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setCommentText("")}
                    className="px-4 py-2 rounded-md border text-sm hover:bg-accent transition-colors disabled:opacity-50"
                    disabled={isSubmittingComment}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={isSubmittingComment || !commentText.trim()}
                  >
                    {isSubmittingComment ? "Enviando..." : "Comentar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de comentários */}
          {loadingComentarios ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Carregando comentários...</p>
            </div>
          ) : comentarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comentarios.map((comment) => (
                <div key={comment.id} className="p-4 rounded-lg bg-secondary/30 border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{comment.autor}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.criadoEm).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {(currentUser?.id === comment.usuarioId || currentUser?.cargo !== "Aluno") && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive hover:text-red-700 transition-colors p-1"
                        title="Excluir comentário"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{comment.conteudo}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
