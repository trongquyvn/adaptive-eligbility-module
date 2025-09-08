import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const api = `${process.env.NEXT_PUBLIC_API_URL}/rules?trial_id=${id}`;
  const res = await fetch(api, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const data = await res.json();
  return NextResponse.json(Array.isArray(data) ? data[0] : data);
}
