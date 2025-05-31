"use client";

import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/auth-context";

export default function Dashboard() {
  const { session, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return session ? (
    <NavBar>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to RevSpot!</h1>
        <p className="text-gray-600">
          You're logged in with {session.user.email}. A place for car spotters
          to share their passion 🚗
        </p>
      </div>
    </NavBar>
  ) : (
    <div>You are not logged in.</div>
  );
}
