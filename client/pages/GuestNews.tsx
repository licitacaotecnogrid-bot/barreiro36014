import { CalendarClock, CheckCircle2, XCircle, Clock, ExternalLink, FileText } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import Logo from "@/components/brand/Logo";
import { Link } from "react-router-dom";

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
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function GuestNews() {
  const { eventos: eventosData, loading } = useEvents();

  const sortedEventos = [...eventosData].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  const featuredEvent = sortedEventos[0];
  const otherEventos = sortedEventos.slice(1).reverse();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-10" wordmark={false} />
            <div>
              <h1 className="text-lg font-semibold">Barreiro 360</h1>
              <p className="text-xs text-muted-foreground">Notícias e Eventos</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-1 sm:gap-2">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Principais Notícias e Eventos</h2>
            <p className="text-sm text-muted-foreground">Curso de Análise e Desenvolvimento de Sistemas</p>
          </div>

          {featuredEvent ? (
            <div className="rounded-lg sm:rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
              {featuredEvent.imagem && (
                <img src={featuredEvent.imagem} alt={featuredEvent.titulo} className="w-full h-32 sm:h-48 object-cover" />
              )}
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary line-clamp-2">{featuredEvent.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {featuredEvent.modalidade === "Presencial" || featuredEvent.modalidade === "Híbrido"
                        ? `Local: ${featuredEvent.local}`
                        : `Modalidade: ${featuredEvent.modalidade}`
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <p className="inline-flex items-center gap-2 text-sm font-medium">
                        <CalendarClock className="size-4" /> {formatDate(featuredEvent.data)}
                      </p>
                      {featuredEvent.modalidade && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          {featuredEvent.modalidade}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {featuredEvent.link && (featuredEvent.modalidade === "Online" || featuredEvent.modalidade === "Híbrido") && (
                        <a
                          href={featuredEvent.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                        >
                          <ExternalLink className="size-4" /> Acessar Link
                        </a>
                      )}
                      {featuredEvent.documento && (
                        <a
                          href={featuredEvent.documento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90"
                        >
                          <FileText className="size-4" /> Documento
                        </a>
                      )}
                      <BadgeStatus status={featuredEvent.status} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="rounded-lg sm:rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden p-4 sm:p-6 md:p-8">
              <p className="text-sm text-muted-foreground">Carregando eventos...</p>
            </div>
          ) : (
            <div className="rounded-lg sm:rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden p-4 sm:p-6 md:p-8">
              <p className="text-sm text-muted-foreground">Nenhum evento disponível</p>
            </div>
          )}

          {otherEventos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">Outras notícias</h3>
              <div className="space-y-3">
                {otherEventos.map((evento) => (
                  <div key={evento.id} className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
                    {evento.imagem && (
                      <img src={evento.imagem} alt={evento.titulo} className="w-full h-24 sm:h-32 object-cover" />
                    )}
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-medium truncate">{evento.titulo}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {evento.modalidade === "Presencial" || evento.modalidade === "Híbrido"
                              ? evento.local
                              : evento.modalidade || "Online"
                            }
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarClock className="size-4" /> {formatDate(evento.data)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {evento.link && (evento.modalidade === "Online" || evento.modalidade === "Híbrido") && (
                              <a
                                href={evento.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:opacity-90"
                              >
                                <ExternalLink className="size-3" /> Acessar
                              </a>
                            )}
                            {evento.documento && (
                              <a
                                href={evento.documento}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:opacity-90"
                              >
                                <FileText className="size-3" /> Doc
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

        </div>
      </main>
    </div>
  );
}
