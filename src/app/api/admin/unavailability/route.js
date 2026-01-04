import connectToDatabase from "@/lib/mongodb";
import IrinaUnavailability from "@/models/IrinaUnavailability";
import { adminAuth } from "@/lib/adminAuth";
import { checkUnavailabilityConflicts } from "@/lib/conflictCheck";

export async function GET(request) {
  try {
    const auth = adminAuth(request);
    if (!auth.success) {
      return Response.json(
        { success: false, error: auth.error },
        { status: 401 },
      );
    }

    await connectToDatabase();
    const unavailabilities = await IrinaUnavailability.find({}).sort({
      date: 1,
    });

    return Response.json({ success: true, data: unavailabilities });
  } catch (error) {
    console.error("Error fetching unavailabilities:", error);
    return Response.json(
      { success: false, error: "Failed to fetch unavailabilities" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const auth = adminAuth(request);
    if (!auth.success) {
      return Response.json(
        { success: false, error: auth.error },
        { status: 401 },
      );
    }

    await connectToDatabase();
    const body = await request.json();

    // Validate required fields
    const { date, startTime, endTime } = body;
    if (!date || !startTime || !endTime) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check for time conflicts
    const conflictCheck = await checkUnavailabilityConflicts(
      date,
      startTime,
      endTime,
    );
    if (conflictCheck.hasConflict) {
      return Response.json(
        { success: false, error: conflictCheck.message },
        { status: 409 },
      );
    }

    const newUnavailability = new IrinaUnavailability(body);
    await newUnavailability.save();

    return Response.json(
      { success: true, data: newUnavailability },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating unavailability:", error);
    return Response.json(
      { success: false, error: "Failed to create unavailability" },
      { status: 500 },
    );
  }
}
