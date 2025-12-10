import { useState } from "react";
import { Status } from "@/data/mock";
import { useEvents } from "@/hooks/use-events";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StatusSelectorProps {
  eventoId: number;
  currentStatus: Status;
  editable?: boolean;
}

const statuses: Status[] = ["Pendente", "Confirmado", "Cancelado"];

const statusColors: Record<Status, string> = {
  Confirmado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function StatusSelector({
  eventoId,
  currentStatus,
  editable = true,
}: StatusSelectorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateEvento } = useEvents();

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === currentStatus) {
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      await updateEvento(eventoId, { status: newStatus });
      toast.success(`Status alterado para ${newStatus}`);
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao alterar status");
    } finally {
      setLoading(false);
    }
  };

  if (!editable) {
    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
          statusColors[currentStatus]
        )}
      >
        {currentStatus}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity",
            statusColors[currentStatus]
          )}
          disabled={loading}
        >
          {loading ? "Atualizando..." : currentStatus}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
            Alterar Status
          </p>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={loading}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                currentStatus === status
                  ? "bg-secondary font-medium"
                  : "hover:bg-secondary"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
