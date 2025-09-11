import { API_CALL_URL } from "@/constants";
import { NextResponse } from "next/server";

export async function GET() {
  // request: Request,
  // { params }: { params: Promise<{ id: string }> }
  const api = `${API_CALL_URL}/rules`;
  const res = await fetch(api, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const api = `${API_CALL_URL}/rules`;
    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to save Rule", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: err.message },
      { status: 500 }
    );
  }
}