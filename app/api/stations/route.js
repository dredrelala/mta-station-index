export async function GET() {
  const stations = [
    {
      name: "Newkirk Av-Little Haiti",
      line: "Nostrand",
      borough: "Bk",
      score: 50,
      reliability: 6,
      crowding: 7,
      accessibility: 4,
      transfers: 2,
      delay_score: 8,
      elevator: false,
      updated: "Today"
    },

    {
      name: "Jefferson St",
      line: "Canarsie",
      borough: "Bk",
      score: 50,
      reliability: 8,
      crowding: 5,
      accessibility: 6,
      transfers: 3,
      delay_score: 4,
      elevator: true,
      updated: "Today"
    },

    {
      name: "Times Sq-42 St",
      line: "Broadway",
      borough: "M",
      score: 92,
      reliability: 9,
      crowding: 10,
      accessibility: 10,
      transfers: 10,
      delay_score: 2,
      elevator: true,
      updated: "Today"
    }
  ];

  return Response.json({
    success: true,
    stations
  });
}
