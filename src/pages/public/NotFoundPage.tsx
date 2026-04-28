import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Ruta no encontrada</h1>
        <p className="mt-2 text-muted-foreground">La pantalla solicitada no existe en Candle Match.</p>
        <Button asChild className="mt-5">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
