import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { title, image_path } = await request.json();

    const authHeader = request.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];

    // Validate user token and get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error: insertError } = await supabase.from("posts").insert([
      {
        title,
        image_path,
        user_id: user.id,
      },
    ]);

    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 });

    return NextResponse.json({ message: "Post created" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
