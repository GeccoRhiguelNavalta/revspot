"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "@/context/auth-context";

export default function NavBar({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
    }
  }, [loading, session, router]);

  if (loading || !session) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="w-full bg-gray-800 text-white p-4 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")}>
          <HomeIcon />
        </button>
        <h1 className="text-xl font-bold">RevSpot</h1>
        <button onClick={() => router.push("/settings")}>
          <SettingsIcon />
        </button>
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
}
