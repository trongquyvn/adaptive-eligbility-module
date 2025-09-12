import { API_CALL_URL } from "@/constants";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const safeId = encodeURIComponent(id); 
    const body = await req.json();
    const api = `${API_CALL_URL}/patient/${safeId}`;
    const res = await fetch(api, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to save patient", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PUT /patients error:", err);
    return NextResponse.json(
      { error: "Failed to update patient", details: err.message },
      { status: 500 }
    );
  }
}
