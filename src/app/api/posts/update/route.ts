import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(request: NextRequest) {
  try {
    const { id, title } = await request.json();

    const { error } = await supabase
      .from("posts")
      .update({ title })
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Post updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
