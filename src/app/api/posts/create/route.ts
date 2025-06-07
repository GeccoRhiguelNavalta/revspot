import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { title, image_path } = await req.json();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }

    // Decode the token to get user id
    const decoded = jwt.decode(token) as { sub?: string } | null;
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Create supabase client with token (no auth methods available)
    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        accessToken: () => Promise.resolve(token),
      }
    );

    const { error } = await supabaseUser.from("posts").insert({
      title,
      image_path,
      user_id: userId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
