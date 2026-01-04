import Booking from "@/models/Booking";
import Workshop from "@/models/Workshop";
import IrinaUnavailability from "@/models/IrinaUnavailability";

export async function checkWorkshopConflicts(date, startTime, endTime) {
  // Check if there's a booking at this time
  const bookingConflict = await Booking.findOne({
    sessionDates: { $in: [date] },
    startTime,
    endTime,
  });

  if (bookingConflict) {
    return {
      hasConflict: true,
      type: "booking",
      message: "Time slot conflict: Booking exists at this time",
    };
  }

  // Check if there's unavailability at this time
  const unavailabilityConflict = await IrinaUnavailability.findOne({
    date,
    startTime,
    endTime,
  });

  if (unavailabilityConflict) {
    return {
      hasConflict: true,
      type: "unavailability",
      message: "Time slot conflict: Unavailability block exists at this time",
    };
  }

  return { hasConflict: false };
}

export async function checkUnavailabilityConflicts(date, startTime, endTime) {
  // Check if there's a workshop at this time
  const workshopConflict = await Workshop.findOne({
    date,
    startTime,
    endTime,
  });

  if (workshopConflict) {
    return {
      hasConflict: true,
      type: "workshop",
      message: "Time slot conflict: Workshop exists at this time",
    };
  }

  // Check if there's a booking at this time
  const bookingConflict = await Booking.findOne({
    sessionDates: { $in: [date] },
    startTime,
    endTime,
  });

  if (bookingConflict) {
    return {
      hasConflict: true,
      type: "booking",
      message: "Time slot conflict: Booking exists at this time",
    };
  }

  return { hasConflict: false };
}
