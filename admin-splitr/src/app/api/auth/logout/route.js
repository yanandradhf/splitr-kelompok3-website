import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
export async function POST(request) {
  try {
    // Get sessionId from cookies
    const sessionId = request.cookies.get("sessionId")?.value;

    console.log("Logging out session:", sessionId);

    if (sessionId) {
      // Call external API to invalidate session
      const response = await fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      console.log("Logout API response:", data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true }); // Always return success for logout
  }
}
