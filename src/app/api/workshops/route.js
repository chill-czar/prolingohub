import connectToDatabase from "@/lib/mongodb";
import Workshop from "@/models/Workshop";

export async function GET() {
  try {
    await connectToDatabase();

    const workshops = await Workshop.find({}).sort({ date: 1 });

    return Response.json({ success: true, data: workshops });
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return Response.json(
      { success: false, error: "Failed to fetch workshops" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const workshop = new Workshop(body);
    await workshop.save();

    return Response.json({ success: true, data: workshop }, { status: 201 });
  } catch (error) {
    console.error("Error creating workshop:", error);
    return Response.json(
      { success: false, error: "Failed to create workshop" },
      { status: 500 },
    );
  }
}
