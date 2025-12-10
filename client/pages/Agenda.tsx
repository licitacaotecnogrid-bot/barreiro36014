import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEvents } from "@/hooks/use-events";

const statusColor: Record<string, { bg: string; text: string; border: string }> = {
  Confirmado: { bg: "bg-green-100", text: "text-green-800", border: "border-l-4 border-green-500" },
  Pendente: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-l-4 border-yellow-500" },
  Cancelado: { bg: "bg-red-100", text: "text-red-800", border: "border-l-4 border-red-500" },
};

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function Agenda() {
  const { eventos } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const eventMap = useMemo(() => {
    const map: Record<string, typeof eventos> = {};
    eventos.forEach((e) => {
      const d = new Date(e.data);
      if (isNaN(d.getTime())) return;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${day}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [eventos]);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const selectedDateKey = `${year}-${month}-${day}`;
  const selectedEvents = eventMap[selectedDateKey] || [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-3xl font-semibold capitalize">{monthName}</h1>
        <button
          onClick={handleToday}
          className="px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium hover:bg-accent transition-colors"
        >
          Hoje
        </button>
      </div>

      <div className="grid gap-3 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_350px]">
        <div className="rounded-lg sm:rounded-xl border bg-card">
          <div className="flex items-center justify-between p-2 sm:p-4 border-b">
            <button
              onClick={handlePrevMonth}
              className="p-1 sm:p-2 hover:bg-accent rounded-lg transition"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            <h2 className="text-sm sm:text-lg font-semibold capitalize text-center flex-1">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="p-1 sm:p-2 hover:bg-accent rounded-lg transition"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>

          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {diasSemana.map((dia) => (
                <div key={dia} className="text-center font-semibold text-xs sm:text-sm py-1.5 sm:py-3 text-muted-foreground">
                  {dia}
                </div>
              ))}

              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="min-h-12 sm:min-h-24 bg-muted/20 rounded" />;
                }

                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateYear = date.getFullYear();
                const dateMonth = String(date.getMonth() + 1).padStart(2, "0");
                const dateDay = String(date.getDate()).padStart(2, "0");
                const dateKey = `${dateYear}-${dateMonth}-${dateDay}`;
                const dayEvents = eventMap[dateKey] || [];
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-12 sm:min-h-24 border rounded p-1 sm:p-2 cursor-pointer transition text-center ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : isToday
                        ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700"
                        : "bg-card hover:bg-accent"
                    }`}
                  >
                    <div className={`text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 ${isSelected ? "text-primary-foreground" : ""}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5 hidden sm:flex sm:flex-col">
                      {dayEvents.slice(0, 2).map((evento) => (
                        <div
                          key={evento.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            isSelected
                              ? "bg-primary-foreground text-primary"
                              : `${statusColor[evento.status].bg} ${statusColor[evento.status].text}`
                          }`}
                          title={evento.titulo}
                        >
                          {evento.titulo}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className={`text-xs px-1 py-0.5 text-muted-foreground`}>
                          +{dayEvents.length - 2}
                        </div>
                      )}
                    </div>
                    {dayEvents.length > 0 && (
                      <div className={`text-xs rounded-full w-1.5 h-1.5 mx-auto mt-0.5 sm:hidden ${
                        isSelected ? "bg-primary-foreground" : "bg-primary"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl border bg-card p-2 sm:p-4 h-fit lg:sticky lg:top-16">
          <h3 className="text-xs sm:text-base font-semibold mb-2 sm:mb-4">
            {selectedDate.toLocaleDateString("pt-BR", { weekday: "short", month: "short", day: "numeric" })}
          </h3>

          {selectedEvents.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground">Sem eventos</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {selectedEvents.map((evento) => (
                <div
                  key={evento.id}
                  className={`p-2 sm:p-3 rounded-lg ${statusColor[evento.status].bg} ${statusColor[evento.status].border}`}
                >
                  <h4 className={`font-medium text-xs sm:text-sm ${statusColor[evento.status].text} line-clamp-2`}>{evento.titulo}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">{evento.local}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">{evento.responsavel}</p>
                  <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-current border-opacity-20">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[evento.status].text}`}>
                      {evento.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
