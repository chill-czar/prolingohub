import connectToDatabase from "@/lib/mongodb";
import IrinaUnavailability from "@/models/IrinaUnavailability";

export async function GET() {
  try {
    await connectToDatabase();

    const unavailabilities = await IrinaUnavailability.find({}).sort({
      date: 1,
    });

    return Response.json({ success: true, data: unavailabilities });
  } catch (error) {
    console.error("Error fetching Irina unavailabilities:", error);
    return Response.json(
      { success: false, error: "Failed to fetch unavailabilities" },
      { status: 500 },
    );
  }
}
