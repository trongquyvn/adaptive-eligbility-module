import { API_CALL_URL } from "@/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const api = `${API_CALL_URL}/eligibility/logs/`;
    const res = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to logs", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /logs error:", err);
    return NextResponse.json(
      { error: "Failed to logs", details: err.message },
      { status: 500 }
    );
  }
}
