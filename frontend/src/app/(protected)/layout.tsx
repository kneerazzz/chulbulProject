"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader";
import { useAuth } from "@/store/auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  // Ensure Zustand store is ready
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login"); // replace so back button won’t keep looping
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return <Loader />;
  if (!isAuthenticated) return <Loader />; // still redirecting

  return <>{children}</>;
}
