import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "0");
    const limit = parseInt(searchParams.get("limit") ?? "6");

    const { data, error } = await supabase
      .from("posts")
      .select("id,title,image_path,created_at,user_id,likes")
      .order("created_at", { ascending: false })
      .range(page * limit, page * limit + limit - 1);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
