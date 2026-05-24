export async function GET() {
  return Response.json({
    success: true,
    stations: [],
    count: 0,
    updated: new Date().toISOString()
  });
}
