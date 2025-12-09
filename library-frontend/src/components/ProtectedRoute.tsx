"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (!token && !storedToken) {
        router.push("/login");
      }
    }
  }, [token, router]);

  // If we are on server, we can't check localStorage, so render nothing or a loader
  if (typeof window === "undefined") return null;

  if (!token && !localStorage.getItem("token")) {
    return null;
  }

  return <>{children}</>;
}
