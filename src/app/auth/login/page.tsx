"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [login, setLogin] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async () => {
    if (!login || !password) {
      toast.error("Please enter your username/email and password.");
      return;
    }

    let emailToUse = login;

    // If not email, look up email by username from 'profiles' table
    if (!isEmail(login)) {
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("display_name", login)
        .single();

      if (error || !data) {
        toast.error("User not found with that username.");
        return;
      }

      emailToUse = data.email;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Successfully logged in!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Username or Email"
          className="w-full border p-2 rounded mb-2"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="w-full text-center text-blue-600 underline mt-2 text-sm"
        >
          Don&apos;t have an account? Register
        </button>
      </div>
    </div>
  );
}
