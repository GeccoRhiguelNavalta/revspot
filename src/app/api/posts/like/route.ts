import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { post_id } = await request.json();

    const { data, error } = await supabase.rpc("toggle_like", { post_id });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ new_likes: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
