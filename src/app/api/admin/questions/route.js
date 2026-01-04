import connectToDatabase from "@/lib/mongodb";
import Question from "@/models/Question";
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
    const questions = await Question.find({}).sort({ createdAt: -1 });

    return Response.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return Response.json(
      { success: false, error: "Failed to fetch questions" },
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
    const { category, question, options, correctAnswer } = body;
    if (!category || !question || !options || !correctAnswer) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate category enum
    if (!["VOCABULARY", "GRAMMAR", "SPEAKING"].includes(category)) {
      return Response.json(
        { success: false, error: "Invalid category" },
        { status: 400 },
      );
    }

    const newQuestion = new Question(body);
    await newQuestion.save();

    return Response.json({ success: true, data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return Response.json(
      { success: false, error: "Failed to create question" },
      { status: 500 },
    );
  }
}
