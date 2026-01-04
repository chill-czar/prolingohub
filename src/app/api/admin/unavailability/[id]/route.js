import connectToDatabase from "@/lib/mongodb";
import IrinaUnavailability from "@/models/IrinaUnavailability";
import { adminAuth } from "@/lib/adminAuth";
import { checkUnavailabilityConflicts } from "@/lib/conflictCheck";

export async function PUT(request, { params }) {
  try {
    const auth = adminAuth(request);
    if (!auth.success) {
      return Response.json(
        { success: false, error: auth.error },
        { status: 401 },
      );
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    // If updating time fields, check for conflicts
    if (body.date || body.startTime || body.endTime) {
      const unavailability = await IrinaUnavailability.findById(id);
      if (!unavailability) {
        return Response.json(
          { success: false, error: "Unavailability not found" },
          { status: 404 },
        );
      }

      const newDate = body.date || unavailability.date;
      const newStartTime = body.startTime || unavailability.startTime;
      const newEndTime = body.endTime || unavailability.endTime;

      // Check conflicts only if time fields are changing
      if (
        body.date !== unavailability.date ||
        body.startTime !== unavailability.startTime ||
        body.endTime !== unavailability.endTime
      ) {
        const conflictCheck = await checkUnavailabilityConflicts(
          newDate,
          newStartTime,
          newEndTime,
        );
        if (conflictCheck.hasConflict) {
          return Response.json(
            { success: false, error: conflictCheck.message },
            { status: 409 },
          );
        }
      }
    }

    const updatedUnavailability = await IrinaUnavailability.findByIdAndUpdate(
      id,
      body,
      { new: true },
    );

    if (!updatedUnavailability) {
      return Response.json(
        { success: false, error: "Unavailability not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: updatedUnavailability });
  } catch (error) {
    console.error("Error updating unavailability:", error);
    return Response.json(
      { success: false, error: "Failed to update unavailability" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = adminAuth(request);
    if (!auth.success) {
      return Response.json(
        { success: false, error: auth.error },
        { status: 401 },
      );
    }

    await connectToDatabase();
    const { id } = await params;

    const deletedUnavailability =
      await IrinaUnavailability.findByIdAndDelete(id);

    if (!deletedUnavailability) {
      return Response.json(
        { success: false, error: "Unavailability not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: deletedUnavailability });
  } catch (error) {
    console.error("Error deleting unavailability:", error);
    return Response.json(
      { success: false, error: "Failed to delete unavailability" },
      { status: 500 },
    );
  }
}
