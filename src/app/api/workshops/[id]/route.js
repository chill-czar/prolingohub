import connectToDatabase from "@/lib/mongodb";
import Workshop from "@/models/Workshop";

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const deletedWorkshop = await Workshop.findByIdAndDelete(id);

    if (!deletedWorkshop) {
      return Response.json(
        { success: false, error: "Workshop not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: deletedWorkshop });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return Response.json(
      { success: false, error: "Failed to delete workshop" },
      { status: 500 },
    );
  }
}
