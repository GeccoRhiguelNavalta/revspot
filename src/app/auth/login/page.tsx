"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login failed: " + error.message);
    } else {
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white text-black rounded-xl p-6 shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">
          Login to RevSpot
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded mb-2"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="w-full text-center text-blue-600 underline text-sm"
        >
          Don&apos;t have an account? Register
        </button>
      </div>
    </div>
  );
}
