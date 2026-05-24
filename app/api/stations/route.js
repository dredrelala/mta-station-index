import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      return Response.json({
        success: false,
        error: error.message
      });
    }

    return Response.json({
      success: true,
      count: data?.length || 0,
      stations: data || [],
      updated: new Date().toISOString()
    });

  } catch (err) {
    return Response.json({
      success: false,
      error: err.message
    });
  }
}
