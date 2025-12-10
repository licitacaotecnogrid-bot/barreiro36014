import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { useMobileNav } from "@/hooks/use-mobile-nav";

export default function AppLayout() {
  const { isOpen } = useMobileNav();

  return (
    <div className="min-h-screen bg-background grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      {isOpen && <MobileSidebar />}
      <div className="flex flex-col min-w-0">
        <Topbar />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
