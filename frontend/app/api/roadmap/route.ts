import { NextResponse } from "next/server";

export async function GET(trial_id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rules`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch patients");

  return NextResponse.json(res.json());
}
