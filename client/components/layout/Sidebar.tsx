import { NavLink } from "react-router-dom";
import { CalendarDays, ListChecks, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/brand/Logo";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Sidebar() {
  const { currentUser } = useCurrentUser();
  const isStudent = currentUser?.cargo === "Aluno";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: CalendarDays },
    { to: "/eventos", label: isStudent ? "Meus Eventos" : "Eventos", icon: ListChecks },
    { to: "/agenda", label: "Agenda", icon: CalendarDays },
    { to: "/projetos", label: "Projetos", icon: FolderOpen },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-sidebar h-full">
      <div className="h-16 px-4 flex items-center gap-3 border-b shrink-0">
        <div className="w-20"><Logo className="h-12" wordmark={false} /></div>
      </div>
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground border border-sidebar-border"
                  : "text-muted-foreground"
              )
            }
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-xs text-muted-foreground border-t shrink-0">
        © {new Date().getFullYear()} Barreiro 360
      </div>
    </aside>
  );
}
