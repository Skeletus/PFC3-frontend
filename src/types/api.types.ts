export type UserRole = "PATIENT" | "PSYCHOLOGIST" | "ADMIN";
export type Modality = "VIRTUAL" | "PRESENTIAL" | "HYBRID";
export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRISIS";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
export type Gender = "FEMALE" | "MALE" | "NON_BINARY" | "OTHER" | "PREFER_NOT_TO_SAY";

export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  user?: User;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  city?: string | null;
  preferredModality?: Modality | null;
  mainConcern?: string | null;
  urgencyLevel?: UrgencyLevel | null;
  preferredSchedule?: string | null;
  minBudget?: number | null;
  maxBudget?: number | null;
  profileCompleted?: boolean;
}

export interface PsychologistProfile {
  id: string;
  userId: string;
  user?: User;
  licenseNumber?: string | null;
  professionalTitle?: string | null;
  specialties: string[];
  yearsOfExperience?: number | null;
  bio?: string | null;
  sessionPrice?: number | null;
  modalities: Modality[];
  city?: string | null;
  rating?: number | null;
  totalReviews?: number;
  isVerified?: boolean;
}

export interface Availability {
  id: string;
  psychologistId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  modality: Modality;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId?: string;
  psychologistId?: string;
  patient?: PatientProfile;
  psychologist?: PsychologistProfile;
  startsAt: string;
  durationMinutes: number;
  modality: Modality;
  status: AppointmentStatus;
  price: number;
  platformFee?: number;
  psychologistPayout?: number;
  createdAt?: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  platformFee?: number;
  psychologistPayout?: number;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt?: string;
}

export interface Review {
  id: string;
  appointmentId?: string;
  patientId?: string;
  psychologistId?: string;
  patient?: PatientProfile;
  rating: number;
  comment?: string | null;
  createdAt?: string;
}

export interface MatchingRecommendation {
  psychologist: PsychologistProfile;
  score: number;
  reasons: string[];
}

export interface MatchingRequest {
  mainConcern: string;
  urgencyLevel: UrgencyLevel;
  modality: Modality;
  preferredSchedule?: string;
  city?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface AdminDashboardMetrics {
  totalPatients: number;
  totalPsychologists: number;
  verifiedPsychologists: number;
  createdAppointments: number;
  completedAppointments: number;
  platformRevenue: number;
  conversionRate: number;
}

export interface AdminRevenue {
  totalPlatformRevenue: number;
  totalCommissions: number;
  totalPayouts: number;
  paidAppointments: number;
  payments: Payment[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPatientPayload {
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterPsychologistPayload extends RegisterPatientPayload {
  licenseNumber: string;
  professionalTitle: string;
  specialties: string[];
  experienceYears?: number;
  bio?: string;
  sessionPrice: number;
  modalities: Modality[];
  city?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateAppointmentPayload {
  psychologistId: string;
  scheduledAt: string;
  durationMinutes: number;
  modality: Modality;
}

export interface CreateReviewPayload {
  appointmentId: string;
  psychologistId?: string;
  rating: number;
  comment?: string;
}
