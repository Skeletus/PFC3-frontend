import type {
  AdminDashboardMetrics,
  AdminRevenue,
  Appointment,
  MatchingRecommendation,
  PatientProfile,
  Payment,
  PsychologistProfile,
  Review,
  User,
} from "@/types/api.types";

// Backend responses are normalized at the API boundary because Prisma decimals and includes vary by endpoint.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const numberOrNull = (value: unknown) => (value === null || value === undefined ? null : Number(value));

export function normalizeUser(input: AnyRecord): User {
  return {
    id: input.id,
    name: input.name ?? input.fullName ?? "Usuario",
    fullName: input.fullName ?? input.name ?? "Usuario",
    email: input.email,
    phone: input.phone ?? null,
    role: input.role,
    isActive: input.isActive,
    createdAt: input.createdAt,
  };
}

export function normalizePatientProfile(input: AnyRecord): PatientProfile {
  const profile = input.patientProfile ?? input;
  const userSource = profile.user ?? input.user ?? input;
  const user = userSource?.id ? normalizeUser(userSource) : undefined;
  return {
    id: profile.userId ?? input.id,
    userId: profile.userId ?? input.id,
    user,
    dateOfBirth: profile.dateOfBirth ?? profile.birthDate ?? null,
    gender: profile.gender ?? null,
    city: profile.city ?? null,
    preferredModality: profile.preferredModality ?? null,
    mainConcern: profile.mainConcern ?? null,
    urgencyLevel: profile.urgencyLevel ?? null,
    preferredSchedule: profile.preferredSchedule ?? null,
    minBudget: numberOrNull(profile.minBudget ?? profile.budgetMin),
    maxBudget: numberOrNull(profile.maxBudget ?? profile.budgetMax),
    profileCompleted: Boolean(profile.mainConcern && profile.urgencyLevel && profile.preferredModality),
  };
}

export function normalizePsychologistProfile(input: AnyRecord): PsychologistProfile {
  const profile = input.psychologistProfile ?? input;
  const userSource = profile.user ?? input.user ?? input;
  const user = userSource?.id ? normalizeUser(userSource) : undefined;
  return {
    id: profile.userId ?? input.id,
    userId: profile.userId ?? input.id,
    user,
    licenseNumber: profile.licenseNumber ?? null,
    professionalTitle: profile.professionalTitle ?? null,
    specialties: profile.specialties ?? [],
    yearsOfExperience: profile.yearsOfExperience ?? profile.experienceYears ?? 0,
    bio: profile.bio ?? null,
    sessionPrice: numberOrNull(profile.sessionPrice),
    modalities: profile.modalities ?? [],
    city: profile.city ?? null,
    rating: numberOrNull(profile.rating ?? profile.ratingAverage) ?? 0,
    totalReviews: profile.totalReviews ?? 0,
    isVerified: profile.isVerified ?? false,
  };
}

export function normalizePayment(input: AnyRecord | null): Payment | null {
  if (!input) return null;
  return {
    id: input.id,
    appointmentId: input.appointmentId,
    amount: Number(input.amount ?? 0),
    platformFee: Number(input.platformFee ?? 0),
    psychologistPayout: Number(input.psychologistPayout ?? 0),
    status: input.status,
    paidAt: input.paidAt ?? input.updatedAt ?? null,
    createdAt: input.createdAt,
  };
}

function userAsPatient(input?: AnyRecord): PatientProfile | undefined {
  if (!input) return undefined;
  return normalizePatientProfile({ id: input.id, patientProfile: input.patientProfile ?? { userId: input.id }, ...input });
}

function userAsPsychologist(input?: AnyRecord): PsychologistProfile | undefined {
  if (!input) return undefined;
  return normalizePsychologistProfile({ id: input.id, psychologistProfile: input.psychologistProfile ?? { userId: input.id }, ...input });
}

export function normalizeAppointment(input: AnyRecord): Appointment {
  return {
    id: input.id,
    patientId: input.patientId,
    psychologistId: input.psychologistId,
    patient: userAsPatient(input.patient),
    psychologist: userAsPsychologist(input.psychologist),
    startsAt: input.startsAt ?? input.scheduledAt,
    durationMinutes: input.durationMinutes,
    modality: input.modality,
    status: input.status,
    price: Number(input.price ?? 0),
    platformFee: Number(input.platformFee ?? 0),
    psychologistPayout: Number(input.psychologistPayout ?? 0),
    createdAt: input.createdAt,
  };
}

export function normalizeReview(input: AnyRecord): Review {
  return {
    id: input.id,
    appointmentId: input.appointmentId,
    patientId: input.patientId,
    psychologistId: input.psychologistId,
    patient: userAsPatient(input.patient),
    rating: input.rating,
    comment: input.comment,
    createdAt: input.createdAt,
  };
}

export function normalizeRecommendation(input: AnyRecord): MatchingRecommendation {
  return {
    psychologist: normalizePsychologistProfile({
      id: input.psychologistId,
      fullName: input.fullName,
      psychologistProfile: {
        userId: input.psychologistId,
        specialties: input.specialties ?? [],
        modalities: input.modalities ?? [],
        sessionPrice: input.sessionPrice,
        ratingAverage: input.ratingAverage,
        city: input.city,
      },
    }),
    score: Number(input.score ?? 0),
    reasons: input.reasons ?? [],
  };
}

export function unwrapPaginated<T>(input: T[] | { data: T[] }) {
  return Array.isArray(input) ? input : input.data;
}

export function normalizeDashboard(input: AnyRecord): AdminDashboardMetrics {
  return {
    totalPatients: input.totalPatients ?? 0,
    totalPsychologists: input.totalPsychologists ?? 0,
    verifiedPsychologists: input.verifiedPsychologists ?? 0,
    createdAppointments: input.createdAppointments ?? input.appointmentsCreated ?? 0,
    completedAppointments: input.completedAppointments ?? input.appointmentsCompleted ?? 0,
    platformRevenue: Number(input.platformRevenue ?? 0),
    conversionRate: Number(input.conversionRate ?? input.basicConversionRate ?? 0) * 100,
  };
}

export function normalizeRevenue(input: AnyRecord): AdminRevenue {
  const payments = (input.payments ?? input.recentPayments ?? []).map(normalizePayment).filter(Boolean) as Payment[];
  return {
    totalPlatformRevenue: Number(input.totalPlatformRevenue ?? input.platformRevenue ?? 0),
    totalCommissions: Number(input.totalCommissions ?? input.platformRevenue ?? 0),
    totalPayouts: Number(input.totalPayouts ?? input.psychologistPayouts ?? 0),
    paidAppointments: payments.filter((payment) => payment.status === "PAID").length,
    payments,
  };
}
