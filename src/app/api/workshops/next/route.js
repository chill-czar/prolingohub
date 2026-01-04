import connectToDatabase from "@/lib/mongodb";
import Workshop from "@/models/Workshop";

export async function GET() {
  try {
    await connectToDatabase();

    // Get current date for filtering
    const now = new Date();

    // Find the next upcoming workshop
    // Sort by date and startTime, exclude past workshops
    const nextWorkshop = await Workshop.find({
      $or: [
        // Future dates
        { date: { $gt: now } },
        // Today but future start time
        {
          date: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
          startTime: { $gt: now.toTimeString().substring(0, 5) },
        },
      ],
    })
      .sort({ date: 1, startTime: 1 })
      .limit(1);

    if (nextWorkshop.length === 0) {
      return Response.json({
        success: true,
        data: null,
        message: "No upcoming workshops available",
      });
    }

    return Response.json({ success: true, data: nextWorkshop[0] });
  } catch (error) {
    console.error("Error fetching next workshop:", error);
    return Response.json(
      { success: false, error: "Failed to fetch next workshop" },
      { status: 500 },
    );
  }
}
