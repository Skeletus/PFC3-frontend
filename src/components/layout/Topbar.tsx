import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/auth-context";

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-8">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Abrir menú">
        <Menu className="h-5 w-5" />
      </Button>
      <div>
        <div className="text-sm text-muted-foreground">Sesión activa</div>
        <div className="font-medium">{user?.name}</div>
      </div>
      <div className="hidden rounded-full bg-accent px-3 py-1 text-sm font-medium md:block">MVP Candle Match</div>
    </header>
  );
}
