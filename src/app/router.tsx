import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/auth/protected-route";
import { RoleRoute } from "@/auth/role-route";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminAppointmentsPage } from "@/pages/admin/AdminAppointmentsPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminPatientsPage } from "@/pages/admin/AdminPatientsPage";
import { AdminPsychologistsPage } from "@/pages/admin/AdminPsychologistsPage";
import { AdminRevenuePage } from "@/pages/admin/AdminRevenuePage";
import { LandingPage } from "@/pages/public/LandingPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { NotFoundPage } from "@/pages/public/NotFoundPage";
import { RegisterPatientPage } from "@/pages/public/RegisterPatientPage";
import { RegisterPsychologistPage } from "@/pages/public/RegisterPsychologistPage";
import { MatchingPage } from "@/pages/patient/MatchingPage";
import { NewAppointmentPage } from "@/pages/patient/NewAppointmentPage";
import { PatientAppointmentDetailPage } from "@/pages/patient/PatientAppointmentDetailPage";
import { PatientAppointmentsPage } from "@/pages/patient/PatientAppointmentsPage";
import { PatientDashboardPage } from "@/pages/patient/PatientDashboardPage";
import { PatientProfilePage } from "@/pages/patient/PatientProfilePage";
import { PsychologistDetailPage } from "@/pages/patient/PsychologistDetailPage";
import { AvailabilityPage } from "@/pages/psychologist/AvailabilityPage";
import { PsychologistAppointmentDetailPage } from "@/pages/psychologist/PsychologistAppointmentDetailPage";
import { PsychologistAppointmentsPage } from "@/pages/psychologist/PsychologistAppointmentsPage";
import { PsychologistDashboardPage } from "@/pages/psychologist/PsychologistDashboardPage";
import { PsychologistProfilePage } from "@/pages/psychologist/PsychologistProfilePage";
import { PsychologistReviewsPage } from "@/pages/psychologist/PsychologistReviewsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register/patient", element: <RegisterPatientPage /> },
  { path: "/register/psychologist", element: <RegisterPsychologistPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <RoleRoute roles={["PATIENT"]} />,
            children: [
              { path: "/patient", element: <Navigate to="/patient/dashboard" replace /> },
              { path: "/patient/dashboard", element: <PatientDashboardPage /> },
              { path: "/patient/profile", element: <PatientProfilePage /> },
              { path: "/patient/matching", element: <MatchingPage /> },
              { path: "/patient/psychologists/:id", element: <PsychologistDetailPage /> },
              { path: "/patient/appointments/new/:psychologistId", element: <NewAppointmentPage /> },
              { path: "/patient/appointments", element: <PatientAppointmentsPage /> },
              { path: "/patient/appointments/:id", element: <PatientAppointmentDetailPage /> },
            ],
          },
          {
            element: <RoleRoute roles={["PSYCHOLOGIST"]} />,
            children: [
              { path: "/psychologist", element: <Navigate to="/psychologist/dashboard" replace /> },
              { path: "/psychologist/dashboard", element: <PsychologistDashboardPage /> },
              { path: "/psychologist/profile", element: <PsychologistProfilePage /> },
              { path: "/psychologist/availability", element: <AvailabilityPage /> },
              { path: "/psychologist/appointments", element: <PsychologistAppointmentsPage /> },
              { path: "/psychologist/appointments/:id", element: <PsychologistAppointmentDetailPage /> },
              { path: "/psychologist/reviews", element: <PsychologistReviewsPage /> },
            ],
          },
          {
            element: <RoleRoute roles={["ADMIN"]} />,
            children: [
              { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> },
              { path: "/admin/dashboard", element: <AdminDashboardPage /> },
              { path: "/admin/patients", element: <AdminPatientsPage /> },
              { path: "/admin/psychologists", element: <AdminPsychologistsPage /> },
              { path: "/admin/appointments", element: <AdminAppointmentsPage /> },
              { path: "/admin/revenue", element: <AdminRevenuePage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
