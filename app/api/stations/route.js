export async function GET() {
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

  const stations = data.filter(station =>
    station.name &&
    station.borough
  );

  return Response.json({
    success: true,
    count: stations.length,
    stations: stations,
    updated: new Date().toISOString()
  });
}
