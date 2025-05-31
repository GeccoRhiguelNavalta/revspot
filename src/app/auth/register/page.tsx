"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      toast.error("Registration failed: " + error.message);
    } else {
      toast.success("Account created! Redirecting...");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white text-black rounded-xl p-6 shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">
          Register for RevSpot
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-black text-white p-2 rounded mb-2"
        >
          Register
        </button>
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full text-center text-blue-600 underline text-sm"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
