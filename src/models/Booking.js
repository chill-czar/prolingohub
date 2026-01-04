import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    englishLevel: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    bookingType: {
      type: String,
      enum: ["WORKSHOP", "PRIVATE_1_1", "PRIVATE_4_PACKAGE"],
      required: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: false,
    },
    sessionDates: [
      {
        type: Date,
        required: false,
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
