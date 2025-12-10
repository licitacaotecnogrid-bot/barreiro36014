import { CalendarClock, CheckCircle2, XCircle, Clock, ExternalLink, FileText } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEvents } from "@/hooks/use-events";

function BadgeStatus({ status }: { status: "Confirmado" | "Pendente" | "Cancelado" }) {
  const map = {
    Confirmado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  } as const;
  const Icon = status === "Confirmado" ? CheckCircle2 : status === "Pendente" ? Clock : XCircle;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      <Icon className="size-3.5" /> {status}
    </span>
  );
}

function formatDate(dateString: string): string {
  if (!dateString) return "Data não disponível";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Dashboard() {
  const { currentUser } = useCurrentUser();
  const { eventos: eventosData, loading } = useEvents();

  const sortedEventos = [...eventosData].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  const featuredEvent = sortedEventos[0];
  const otherEventos = sortedEventos.slice(1).reverse();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Bem-vindo(a)</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Principais notícias e eventos - Curso de Análise e Desenvolvimento de Sistemas</p>
      </div>

      {featuredEvent ? (
        <div className="rounded-lg sm:rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          {featuredEvent.imagem && (
            <img src={featuredEvent.imagem} alt={featuredEvent.titulo} className="w-full h-32 sm:h-48 object-cover" />
          )}
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary line-clamp-2">{featuredEvent.titulo}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  Local: {featuredEvent.local}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <p className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                  <CalendarClock className="size-3 sm:size-4" /> {formatDate(featuredEvent.data)}
                </p>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {featuredEvent.link && (
                    <a
                      href={featuredEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                    >
                      <ExternalLink className="size-3" /> <span className="hidden sm:inline">Mais Info</span>
                    </a>
                  )}
                  {featuredEvent.documento && (
                    <a
                      href={featuredEvent.documento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-90"
                    >
                      <FileText className="size-3" /> <span className="hidden sm:inline">Documento</span>
                    </a>
                  )}
                  <BadgeStatus status={featuredEvent.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="rounded-lg sm:rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden p-3 sm:p-4 md:p-6">
          <p className="text-sm text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : (
        <div className="rounded-lg sm:rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden p-3 sm:p-4 md:p-6">
          <p className="text-sm text-muted-foreground">Nenhum evento disponível</p>
        </div>
      )}

      {otherEventos.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold">Outras notícias</h3>
          <div className="space-y-2">
            {otherEventos.map((evento) => (
              <div key={evento.id} className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
                {evento.imagem && (
                  <img src={evento.imagem} alt={evento.titulo} className="w-full h-24 sm:h-32 object-cover" />
                )}
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium truncate">{evento.titulo}</h4>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">{evento.local}</p>
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-2 shrink-0">
                      <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                        <p className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <CalendarClock className="size-3 sm:size-4" /> {formatDate(evento.data)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {evento.link && (
                          <a
                            href={evento.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:opacity-90"
                          >
                            <ExternalLink className="size-2.5 sm:size-3" /> <span className="hidden sm:inline">Info</span>
                          </a>
                        )}
                        {evento.documento && (
                          <a
                            href={evento.documento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:opacity-90"
                          >
                            <FileText className="size-2.5 sm:size-3" /> <span className="hidden sm:inline">Doc</span>
                          </a>
                        )}
                        <BadgeStatus status={evento.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="rounded-lg sm:rounded-xl border bg-card p-3 sm:p-5">
          <h3 className="text-sm sm:text-base font-medium">Atalhos rápidos</h3>
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <a href="/eventos" className="rounded-lg border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-accent transition-colors">
              Ver eventos
            </a>
            <a href="/agenda" className="rounded-lg border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-accent transition-colors">
              Abrir agenda
            </a>
          </div>
        </div>
        <div className="rounded-lg sm:rounded-xl border bg-card p-3 sm:p-5">
          <h3 className="text-sm sm:text-base font-medium">Status</h3>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Acompanhe os principais eventos e notícias da faculdade de Análise e Desenvolvimento de Sistemas.
          </p>
        </div>
      </div>
    </div>
  );
}
