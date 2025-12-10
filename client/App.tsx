import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/hooks/use-current-user";
import { EventsProvider } from "@/hooks/use-events";
import { MobileNavProvider } from "@/hooks/use-mobile-nav";
import { ProfessoresProvider } from "@/hooks/use-professores";
import { ProjetosProvider } from "@/hooks/use-projetos";
import { MateriasProvider } from "@/hooks/use-materias";
import { ComentariosProvider } from "@/hooks/use-comentarios";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GuestNews from "./pages/GuestNews";
import AppLayout from "@/components/layout/AppLayout";
import Eventos from "./pages/Eventos";
import EventoForm from "./pages/EventoForm";
import EventoDetalhes from "./pages/EventoDetalhes";
import Agenda from "./pages/Agenda";
import Projetos from "./pages/Projetos";
import ProjetoForm from "./pages/ProjetoForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <EventsProvider>
          <ComentariosProvider>
            <ProfessoresProvider>
              <ProjetosProvider>
                <MateriasProvider>
                  <MobileNavProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Navigate to="/noticias" replace />} />
                    <Route path="/noticias" element={<GuestNews />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<AppLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/eventos" element={<Eventos />} />
                      <Route path="/eventos/novo" element={<EventoForm />} />
                      <Route path="/eventos/:id" element={<EventoDetalhes />} />
                      <Route path="/eventos/:id/editar" element={<EventoForm />} />
                      <Route path="/agenda" element={<Agenda />} />
                      <Route path="/projetos" element={<Projetos />} />
                      <Route path="/projetos/novo" element={<ProjetoForm />} />
                      <Route path="/projetos/:id/:type/editar" element={<ProjetoForm />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                  </MobileNavProvider>
                </MateriasProvider>
              </ProjetosProvider>
            </ProfessoresProvider>
          </ComentariosProvider>
        </EventsProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
