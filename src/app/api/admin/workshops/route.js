import connectToDatabase from "@/lib/mongodb";
import Workshop from "@/models/Workshop";
import { adminAuth } from "@/lib/adminAuth";
import { checkWorkshopConflicts } from "@/lib/conflictCheck";

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
    const { title, description, date, startTime, endTime, capacity } = body;
    if (
      !title ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      capacity === undefined
    ) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check for time conflicts
    const conflictCheck = await checkWorkshopConflicts(
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

    const newWorkshop = new Workshop(body);
    await newWorkshop.save();

    return Response.json({ success: true, data: newWorkshop }, { status: 201 });
  } catch (error) {
    console.error("Error creating workshop:", error);
    return Response.json(
      { success: false, error: "Failed to create workshop" },
      { status: 500 },
    );
  }
}
