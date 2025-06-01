"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Step 1: Register with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: username },
      },
    });

    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }

    if (!data.user) {
      toast.error("User registration failed");
      return;
    }

    // Step 2: Insert profile data
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        display_name: username,
        email,
      },
    ]);

    if (profileError) {
      // Optional: cleanup auth user if profile insert fails
      await supabase.auth.admin?.deleteUser(data.user.id); // This only works if you're an admin
      toast.error("Failed to save user profile. Try again.");
      return;
    }

    toast.success(
      "Registered successfully. Please check your email to verify your account."
    );
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-4">Register</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-black text-white p-2 rounded"
        >
          Register
        </button>
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full text-center text-blue-600 underline mt-2 text-sm"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
