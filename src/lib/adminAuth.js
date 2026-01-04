export function adminAuth(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return { success: false, error: "Authorization header missing" };
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "advpass321";

  if (authHeader !== adminPassword) {
    return { success: false, error: "Invalid admin password" };
  }

  return { success: true };
}
