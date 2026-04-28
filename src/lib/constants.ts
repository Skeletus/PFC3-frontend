import { DayOfWeek, Modality, UrgencyLevel } from "@/types/api.types";

export const roleLabels = {
  PATIENT: "Paciente",
  PSYCHOLOGIST: "Psicologo",
  ADMIN: "Administrador",
} as const;

export const modalityLabels: Record<Modality, string> = {
  VIRTUAL: "Online",
  PRESENTIAL: "Presencial",
  HYBRID: "Hibrida",
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRISIS: "Crisis",
};

export const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miercoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sabado",
  SUNDAY: "Domingo",
};

export const specialties = [
  "ansiedad",
  "depresion",
  "estres",
  "autoestima",
  "pareja",
  "duelo",
  "trauma",
  "familia",
  "adolescentes",
  "orientacion vocacional",
];
