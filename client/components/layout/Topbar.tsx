import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMobileNav } from "@/hooks/use-mobile-nav";
import { cn } from "@/lib/utils";

export default function Topbar() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { toggle, isOpen } = useMobileNav();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between gap-2">
        <button
          onClick={toggle}
          className={cn(
            "md:hidden inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-md border text-sm hover:bg-accent transition-colors",
            isOpen && "bg-accent"
          )}
          aria-label="Abrir menu"
        >
          <Menu className="size-4" />
          <span className="hidden sm:inline">Menu</span>
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{currentUser?.email || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.cargo || "Convidado"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm border hover:bg-accent transition-colors"
            title="Sair"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
