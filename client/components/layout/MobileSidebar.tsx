import { NavLink } from "react-router-dom";
import { CalendarDays, ListChecks, X, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMobileNav } from "@/hooks/use-mobile-nav";

export default function MobileSidebar() {
  const { currentUser } = useCurrentUser();
  const { close, isOpen } = useMobileNav();
  const isStudent = currentUser?.cargo === "Aluno";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: CalendarDays },
    { to: "/eventos", label: isStudent ? "Meus Eventos" : "Eventos", icon: ListChecks },
    { to: "/agenda", label: "Agenda", icon: CalendarDays },
    { to: "/projetos", label: "Projetos", icon: FolderOpen },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-16 left-0 w-64 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-200 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <nav className="p-2 space-y-1 flex-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={close}
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
          <div className="p-4 text-xs text-muted-foreground border-t">
            © {new Date().getFullYear()} Barreiro 360
          </div>
        </div>
      </aside>
    </>
  );
}
