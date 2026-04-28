import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:fixed md:inset-y-0 md:flex">
        <Sidebar />
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-black/50" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">
            <Sidebar />
          </div>
        </div>
      ) : null}
      <div className="md:pl-72">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
