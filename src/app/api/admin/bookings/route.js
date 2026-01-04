import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { adminAuth } from "@/lib/adminAuth";

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
    const bookings = await Booking.find({})
      .populate("workshopId", "title date startTime endTime")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
