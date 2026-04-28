# Candle Match Frontend

Frontend MVP para Candle Match, marketplace que conecta pacientes con psicólogos disponibles mediante matching inteligente.

## Stack

- React + TypeScript + Vite
- TailwindCSS + componentes estilo shadcn/ui
- React Router
- React Hook Form + Zod
- TanStack Query
- Axios
- Sonner
- Lucide React

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

Variable requerida:

```bash
VITE_API_URL=http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Rutas

Públicas:

- `/`
- `/login`
- `/register/patient`
- `/register/psychologist`

Paciente:

- `/patient/dashboard`
- `/patient/profile`
- `/patient/matching`
- `/patient/psychologists/:id`
- `/patient/appointments/new/:psychologistId`
- `/patient/appointments`
- `/patient/appointments/:id`

Psicólogo:

- `/psychologist/dashboard`
- `/psychologist/profile`
- `/psychologist/availability`
- `/psychologist/appointments`
- `/psychologist/appointments/:id`
- `/psychologist/reviews`

Admin:

- `/admin/dashboard`
- `/admin/patients`
- `/admin/psychologists`
- `/admin/appointments`
- `/admin/revenue`

## Flujo demo

1. Paciente se registra y completa perfil.
2. Paciente ejecuta matching desde perfil o búsqueda manual.
3. Paciente revisa perfil de psicólogo y reserva sesión.
4. El sistema crea cita y permite pago simulado.
5. Psicólogo confirma y completa la cita.
6. Paciente envía reseña.
7. Admin visualiza métricas, usuarios, citas e ingresos.

## Backend esperado

El cliente consume endpoints bajo `VITE_API_URL` y envía JWT en `Authorization: Bearer <token>`.
Las llamadas están centralizadas en `src/api` y el estado remoto se maneja con TanStack Query.
