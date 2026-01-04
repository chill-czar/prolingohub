import connectToDatabase from "@/lib/mongodb";
import Workshop from "@/models/Workshop";
import Booking from "@/models/Booking";
import { adminAuth } from "@/lib/adminAuth";
import { checkWorkshopConflicts } from "@/lib/conflictCheck";

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
      const workshop = await Workshop.findById(id);
      if (!workshop) {
        return Response.json(
          { success: false, error: "Workshop not found" },
          { status: 404 },
        );
      }

      const newDate = body.date || workshop.date;
      const newStartTime = body.startTime || workshop.startTime;
      const newEndTime = body.endTime || workshop.endTime;

      // Check conflicts only if time fields are changing
      if (
        body.date !== workshop.date ||
        body.startTime !== workshop.startTime ||
        body.endTime !== workshop.endTime
      ) {
        const conflictCheck = await checkWorkshopConflicts(
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

    const updatedWorkshop = await Workshop.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedWorkshop) {
      return Response.json(
        { success: false, error: "Workshop not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: updatedWorkshop });
  } catch (error) {
    console.error("Error updating workshop:", error);
    return Response.json(
      { success: false, error: "Failed to update workshop" },
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

    // Check if workshop has active bookings
    const activeBookings = await Booking.find({ workshopId: id });
    if (activeBookings.length > 0) {
      return Response.json(
        {
          success: false,
          error: "Cannot delete workshop: Active bookings exist",
        },
        { status: 409 },
      );
    }

    const deletedWorkshop = await Workshop.findByIdAndDelete(id);

    if (!deletedWorkshop) {
      return Response.json(
        { success: false, error: "Workshop not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: deletedWorkshop });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return Response.json(
      { success: false, error: "Failed to delete workshop" },
      { status: 500 },
    );
  }
}
