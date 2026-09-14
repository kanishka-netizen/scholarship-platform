"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { apiFetch } from "./lib/api";
import {
  getSupabaseClient,
  supabaseConfigured,
} from "./lib/supabase";

type PrismaUser = {
  id: string;
  email: string;
  name?: string | null;
  profile?: StudentProfile | null;
};

export type StudentProfile = {
  id?: string;
  state?: string | null;
  district?: string | null;
  college?: string | null;
  course?: string | null;
  branch?: string | null;
  yearOfStudy?: number | null;
  semester?: number | null;
  currentPercentage?: number | null;
  currentCGPA?: number | null;
  annualFamilyIncome?: number | null;
  incomeCertificate?: boolean | null;
  ews?: boolean | null;
  dependents?: number | null;
  category?: string | null;
  disabilityStatus?: string | null;
  additionalInfo?: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  prismaUser: PrismaUser | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshPrismaUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [prismaUser, setPrismaUser] = useState<PrismaUser | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  async function loadPrismaUser(nextSession: Session | null) {
    if (!nextSession) {
      setPrismaUser(null);
      return;
    }

    try {
      const nextUser = await apiFetch<PrismaUser>(
        "/users/me",
        nextSession.access_token,
      );
      setPrismaUser(nextUser);
    } catch {
      setPrismaUser(null);
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      return;
    }

    const supabase = getSupabaseClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      void loadPrismaUser(data.session).finally(() => setLoading(false));
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        void loadPrismaUser(nextSession);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    if (!supabaseConfigured) {
      return "Set the public Supabase frontend variables before signing in.";
    }

    const { error } = await getSupabaseClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    return error?.message ?? null;
  }

  async function signOut() {
    if (supabaseConfigured) await getSupabaseClient().auth.signOut();
    setSession(null);
    setPrismaUser(null);
  }

  async function refreshPrismaUser() {
    await loadPrismaUser(session);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        prismaUser,
        loading,
        configured: supabaseConfigured,
        signInWithGoogle,
        signOut,
        refreshPrismaUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
