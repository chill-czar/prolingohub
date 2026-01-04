import connectToDatabase from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    // Build query object
    const query = { isActive: true };

    // Validate and add category filter if provided
    if (category) {
      const validCategories = ["VOCABULARY", "GRAMMAR", "SPEAKING"];
      if (!validCategories.includes(category.toUpperCase())) {
        return Response.json(
          {
            success: false,
            error: "Invalid category. Must be VOCABULARY, GRAMMAR, or SPEAKING"
          },
          { status: 400 },
        );
      }
      query.category = category.toUpperCase();
    }

    // Validate and parse limit if provided
    let limitValue = null;
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return Response.json(
          { success: false, error: "Limit must be a positive number" },
          { status: 400 },
        );
      }
      limitValue = parsedLimit;
    }

    // Execute query with optional limit
    let queryBuilder = Question.find(query);
    if (limitValue) {
      queryBuilder = queryBuilder.limit(limitValue);
    }

    const questions = await queryBuilder;

    return Response.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return Response.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}
