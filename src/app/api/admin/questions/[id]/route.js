import connectToDatabase from "@/lib/mongodb";
import Question from "@/models/Question";
import { adminAuth } from "@/lib/adminAuth";

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

    // Validate category if provided
    if (
      body.category &&
      !["VOCABULARY", "GRAMMAR", "SPEAKING"].includes(body.category)
    ) {
      return Response.json(
        { success: false, error: "Invalid category" },
        { status: 400 },
      );
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedQuestion) {
      return Response.json(
        { success: false, error: "Question not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: updatedQuestion });
  } catch (error) {
    console.error("Error updating question:", error);
    return Response.json(
      { success: false, error: "Failed to update question" },
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

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return Response.json(
        { success: false, error: "Question not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: deletedQuestion });
  } catch (error) {
    console.error("Error deleting question:", error);
    return Response.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
