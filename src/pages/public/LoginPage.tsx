import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { HeartHandshake } from "lucide-react";
import { getErrorMessage } from "@/api/axios";
import { getRoleHome, useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (user) return <Navigate to={getRoleHome(user.role)} replace />;

  const onSubmit = async (values: LoginValues) => {
    try {
      const response = await login(values);
      navigate(getRoleHome(response.user.role), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthShell title="Ingresar a Candle Match">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </Field>
        <Field label="Contraseña" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register("password")} />
        </Field>
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          Ingresar
        </Button>
      </form>
      <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
        <Link className="hover:text-foreground" to="/register/patient">
          Crear cuenta de paciente
        </Link>
        <Link className="hover:text-foreground" to="/register/psychologist">
          Crear cuenta de psicólogo
        </Link>
      </div>
    </AuthShell>
  );
}

export function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center candle-gradient px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
