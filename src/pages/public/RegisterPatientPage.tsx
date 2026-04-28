import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { getRoleHome, useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell, Field } from "@/pages/public/LoginPage";

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type Values = z.infer<typeof schema>;

export function RegisterPatientPage() {
  const { registerPatient } = useAuth();
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", phone: "", password: "" } });

  const onSubmit = async (values: Values) => {
    try {
      const response = await registerPatient(values);
      navigate(getRoleHome(response.user.role), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthShell title="Registro de paciente">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Field label="Nombre" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </Field>
        <Field label="Teléfono" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} />
        </Field>
        <Field label="Contraseña" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register("password")} />
        </Field>
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          Crear cuenta
        </Button>
      </form>
      <Link className="mt-5 block text-sm text-muted-foreground hover:text-foreground" to="/login">
        Ya tengo cuenta
      </Link>
    </AuthShell>
  );
}
