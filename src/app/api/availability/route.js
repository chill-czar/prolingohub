import connectToDatabase from "@/lib/mongodb";
import Workshop from "@/models/Workshop";
import Booking from "@/models/Booking";
import IrinaUnavailability from "@/models/IrinaUnavailability";

// Default available time slots (9 AM to 5 PM, 1-hour blocks)
const DEFAULT_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // Validate date parameter
    if (!dateParam) {
      return Response.json(
        { success: false, error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return Response.json(
        { success: false, error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Parse and validate the date
    const targetDate = new Date(dateParam + "T00:00:00.000Z");
    if (isNaN(targetDate.getTime())) {
      return Response.json(
        { success: false, error: "Invalid date" },
        { status: 400 }
      );
    }

    // Don't show availability for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return Response.json({ success: true, data: [] });
    }

    // Create a set to track occupied time slots
    const occupiedSlots = new Set();

    // Query workshops for the target date
    const workshops = await Workshop.find({
      date: {
        $gte: new Date(targetDate),
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
      },
    }).select("startTime endTime");

    // Query bookings for the target date
    // We check if sessionDates array contains a date that falls within our target range
    const bookings = await Booking.find({
      sessionDates: {
        $gte: new Date(targetDate),
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
      },
    }).select("startTime endTime");

    // Query unavailability for the target date
    const unavailabilities = await IrinaUnavailability.find({
      date: {
        $gte: new Date(targetDate),
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
      },
    }).select("startTime endTime");

    // Helper to add range of slots
    const blockSlots = (startTime, endTime) => {
      let startHour = parseInt(startTime.split(":")[0]);
      let endHour = parseInt(endTime.split(":")[0]);
      // If minutes > 0, we might need to block the next hour too depending on business rules,
      // but assuming strict 1-hour slots starting on the hour:
      // If an event is 10:00 - 12:00, we block 10:00 and 11:00.

      for (let h = startHour; h < endHour; h++) {
        occupiedSlots.add(`${h.toString().padStart(2, "0")}:00`);
      }
    };

    workshops.forEach((w) => blockSlots(w.startTime, w.endTime));
    bookings.forEach((b) => blockSlots(b.startTime, b.endTime));
    unavailabilities.forEach((u) => blockSlots(u.startTime, u.endTime));

    // Filter available slots
    const availableSlots = DEFAULT_TIME_SLOTS.filter(
      (slot) => !occupiedSlots.has(slot)
    );

    return Response.json({ success: true, data: availableSlots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return Response.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
