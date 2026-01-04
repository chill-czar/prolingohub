import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Workshop from "@/models/Workshop";
import { checkWorkshopConflicts } from "@/lib/conflictCheck";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "englishLevel",
      "bookingType",
      "startTime",
      "endTime",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate booking type
    const validTypes = ["WORKSHOP", "PRIVATE_1_1", "PRIVATE_4_PACKAGE"];
    if (!validTypes.includes(body.bookingType)) {
      return Response.json(
        {
          success: false,
          error: "Invalid booking type. Must be WORKSHOP, PRIVATE_1_1, or PRIVATE_4_PACKAGE",
        },
        { status: 400 },
      );
    }

    // Validate workshop booking
    if (body.bookingType === "WORKSHOP") {
      if (!body.workshopId) {
        return Response.json(
          { success: false, error: "Workshop ID is required for workshop bookings" },
          { status: 400 },
        );
      }

      // Check if workshop exists
      const workshop = await Workshop.findById(body.workshopId);
      if (!workshop) {
        return Response.json(
          { success: false, error: "Workshop not found" },
          { status: 404 },
        );
      }

      // Check workshop capacity
      const existingBookings = await Booking.countDocuments({
        workshopId: body.workshopId,
      });

      if (existingBookings >= workshop.capacity) {
        return Response.json(
          { success: false, error: "Workshop is at full capacity" },
          { status: 409 },
        );
      }

      // For workshop bookings, use workshop date and times
      body.sessionDates = [workshop.date.toISOString().split("T")[0]];
      body.startTime = workshop.startTime;
      body.endTime = workshop.endTime;
    }

    // Validate private bookings
    if (body.bookingType === "PRIVATE_1_1" || body.bookingType === "PRIVATE_4_PACKAGE") {
      if (!body.sessionDates || !Array.isArray(body.sessionDates)) {
        return Response.json(
          {
            success: false,
            error: "sessionDates array is required for private bookings",
          },
          { status: 400 },
        );
      }

      // Validate package has exactly 4 sessions
      if (body.bookingType === "PRIVATE_4_PACKAGE" && body.sessionDates.length !== 4) {
        return Response.json(
          {
            success: false,
            error: "4-session package must have exactly 4 dates",
          },
          { status: 400 },
        );
      }

      // Validate single session has exactly 1 date
      if (body.bookingType === "PRIVATE_1_1" && body.sessionDates.length !== 1) {
        return Response.json(
          {
            success: false,
            error: "1:1 session must have exactly 1 date",
          },
          { status: 400 },
        );
      }

      // Check for duplicate dates in package
      if (body.bookingType === "PRIVATE_4_PACKAGE") {
        const uniqueDates = new Set(body.sessionDates);
        if (uniqueDates.size !== body.sessionDates.length) {
          return Response.json(
            {
              success: false,
              error: "4-session package cannot have duplicate dates",
            },
            { status: 400 },
          );
        }
      }

      // Check conflicts for each session date
      for (const date of body.sessionDates) {
        const conflict = await checkWorkshopConflicts(
          date,
          body.startTime,
          body.endTime,
        );
        if (conflict.hasConflict) {
          return Response.json(
            {
              success: false,
              error: `Time conflict on ${date}: ${conflict.message}`,
            },
            { status: 409 },
          );
        }
      }
    }

    // Create and save booking
    const booking = new Booking(body);
    await booking.save();

    return Response.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return Response.json(
        { success: false, error: messages.join(", ") },
        { status: 422 },
      );
    }

    return Response.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
