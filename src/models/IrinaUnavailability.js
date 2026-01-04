import mongoose from "mongoose";

const irinaUnavailabilitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const IrinaUnavailability =
  mongoose.models.IrinaUnavailability ||
  mongoose.model("IrinaUnavailability", irinaUnavailabilitySchema);

export default IrinaUnavailability;
