"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/auth-context";
import NavBar from "@/components/NavBar";

export default function SettingsPage() {
  const { session } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState(session?.user.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out");
      router.push("/auth/login");
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      toast.error("Please enter a new email.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) toast.error(error.message);
    else {
      toast.success("Email updated. You may need to verify it.");
      setEmail(newEmail);
      setNewEmail("");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!newPassword) {
      toast.error("New password cannot be empty.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) toast.error(error.message);
    else {
      toast.success("Password updated!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <NavBar>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-white text-black rounded-xl p-6 shadow-lg w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold text-center">Settings</h1>

          {/* Change Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border p-2 rounded bg-gray-100 mb-2"
            />
            <input
              type="email"
              placeholder="New Email"
              className="w-full border p-2 rounded mb-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button
              onClick={handleChangeEmail}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Change Email
            </button>
          </div>

          {/* Change Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full border p-2 rounded mb-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Change Password
            </button>
          </div>

          {/* Logout */}
          <div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white p-2 rounded"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </NavBar>
  );
}
