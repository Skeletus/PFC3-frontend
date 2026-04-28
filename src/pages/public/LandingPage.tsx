import { Link, Navigate } from "react-router-dom";
import { Brain, CalendarCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleHome, useAuth } from "@/auth/auth-context";

export function LandingPage() {
  const { user } = useAuth();
  if (user) return <Navigate to={getRoleHome(user.role)} replace />;

  return (
    <div className="min-h-screen candle-gradient text-candle-warm">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="text-lg font-semibold">Candle Match</div>
        <Button asChild>
          <Link to="/login">Ingresar</Link>
        </Button>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 px-5 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">Candle Match</h1>
          <p className="mt-5 max-w-2xl text-lg text-candle-warm/78">
            Conecta pacientes con psicólogos disponibles mediante recomendaciones claras, reservas simples y seguimiento administrativo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register/patient">Soy paciente</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20">
              <Link to="/register/psychologist">Soy psicólogo</Link>
            </Button>
          </div>
        </section>
        <section className="grid gap-4">
          {[
            { icon: Search, title: "Matching inteligente", text: "Recomendaciones por motivo, urgencia, modalidad, ciudad y presupuesto." },
            { icon: CalendarCheck, title: "Flujo completo", text: "Reserva, pago simulado, confirmación, finalización y reseña." },
            { icon: Brain, title: "Supervisión admin", text: "Métricas, verificaciones, citas e ingresos desde una consola dedicada." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-white/10 bg-white/10 text-candle-warm shadow-none">
                <CardHeader className="flex-row items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-candle-warm/72">{item.text}</CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
