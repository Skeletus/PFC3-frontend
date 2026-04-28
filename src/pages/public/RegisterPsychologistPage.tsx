import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { getRoleHome, useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AuthShell, Field } from "@/pages/public/LoginPage";
import { modalityLabels, specialties } from "@/lib/constants";
import type { Modality } from "@/types/api.types";

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  licenseNumber: z.string().min(2, "Ingresa tu colegiatura/licencia"),
  professionalTitle: z.string().min(2, "Ingresa tu título profesional"),
  specialties: z.array(z.string()).min(1, "Selecciona al menos una especialidad"),
  experienceYears: z.coerce.number().min(0).optional(),
  bio: z.string().optional(),
  sessionPrice: z.coerce.number().min(1, "Ingresa una tarifa"),
  modalities: z.array(z.enum(["VIRTUAL", "PRESENTIAL", "HYBRID"])).min(1, "Selecciona al menos una modalidad"),
  city: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function RegisterPsychologistPage() {
  const { registerPsychologist } = useAuth();
  const navigate = useNavigate();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      licenseNumber: "",
      professionalTitle: "",
      specialties: [],
      experienceYears: 0,
      bio: "",
      sessionPrice: 0,
      modalities: ["VIRTUAL"],
      city: "",
    },
  });
  const selectedSpecialties = form.watch("specialties");
  const selectedModalities = form.watch("modalities");

  const onSubmit = async (values: Values) => {
    try {
      const response = await registerPsychologist(values);
      navigate(getRoleHome(response.user.role), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthShell title="Registro de psicólogo">
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
        <Field label="Número de colegiatura/licencia" error={form.formState.errors.licenseNumber?.message}>
          <Input {...form.register("licenseNumber")} />
        </Field>
        <Field label="Título profesional" error={form.formState.errors.professionalTitle?.message}>
          <Input {...form.register("professionalTitle")} />
        </Field>
        <Field label="Años de experiencia" error={form.formState.errors.experienceYears?.message}>
          <Input type="number" {...form.register("experienceYears")} />
        </Field>
        <Field label="Tarifa por sesión" error={form.formState.errors.sessionPrice?.message}>
          <Input type="number" {...form.register("sessionPrice")} />
        </Field>
        <Field label="Ciudad" error={form.formState.errors.city?.message}>
          <Input {...form.register("city")} />
        </Field>
        <div className="space-y-2">
          <Label>Especialidades</Label>
          <div className="grid gap-2">
            {specialties.slice(0, 6).map((specialty) => (
              <label key={specialty} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                <Checkbox
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={(event) =>
                    form.setValue(
                      "specialties",
                      event.currentTarget.checked ? [...selectedSpecialties, specialty] : selectedSpecialties.filter((item) => item !== specialty),
                    )
                  }
                />
                {specialty}
              </label>
            ))}
          </div>
          {form.formState.errors.specialties ? <p className="text-xs text-destructive">{form.formState.errors.specialties.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label>Modalidades</Label>
          <div className="grid gap-2">
            {Object.entries(modalityLabels).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                <Checkbox
                  checked={selectedModalities.includes(value as Modality)}
                  onChange={(event) =>
                    form.setValue(
                      "modalities",
                      event.currentTarget.checked ? [...selectedModalities, value as Modality] : selectedModalities.filter((item) => item !== value),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
          {form.formState.errors.modalities ? <p className="text-xs text-destructive">{form.formState.errors.modalities.message}</p> : null}
        </div>
        <Field label="Bio" error={form.formState.errors.bio?.message}>
          <Textarea {...form.register("bio")} />
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
