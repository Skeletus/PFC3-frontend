import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { getAuthToken, setAuthToken } from "@/api/axios";
import type { AuthResponse, LoginPayload, RegisterPatientPayload, RegisterPsychologistPayload, User } from "@/types/api.types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  registerPatient: (payload: RegisterPatientPayload) => Promise<AuthResponse>;
  registerPsychologist: (payload: RegisterPsychologistPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState(Boolean(getAuthToken()));
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isError) {
      setAuthToken(null);
      setHasToken(false);
    }
  }, [meQuery.isError]);

  const persistSession = (response: AuthResponse) => {
    setAuthToken(response.accessToken);
    setHasToken(true);
    queryClient.setQueryData(["auth", "me"], response.user);
    return response;
  };

  const loginMutation = useMutation({ mutationFn: authApi.login, onSuccess: persistSession });
  const patientMutation = useMutation({ mutationFn: authApi.registerPatient, onSuccess: persistSession });
  const psychologistMutation = useMutation({ mutationFn: authApi.registerPsychologist, onSuccess: persistSession });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isAuthenticated: Boolean(meQuery.data),
      isLoading: hasToken && meQuery.isLoading,
      login: loginMutation.mutateAsync,
      registerPatient: patientMutation.mutateAsync,
      registerPsychologist: psychologistMutation.mutateAsync,
      logout: () => {
        setAuthToken(null);
        setHasToken(false);
        queryClient.clear();
      },
    }),
    [hasToken, loginMutation.mutateAsync, meQuery.data, meQuery.isLoading, patientMutation.mutateAsync, psychologistMutation.mutateAsync, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

export function getRoleHome(role: User["role"]) {
  if (role === "PATIENT") return "/patient/dashboard";
  if (role === "PSYCHOLOGIST") return "/psychologist/dashboard";
  return "/admin/dashboard";
}
