import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["VOCABULARY", "GRAMMAR", "SPEAKING"],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
