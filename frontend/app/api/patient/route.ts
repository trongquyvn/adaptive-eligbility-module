import { NextResponse } from "next/server";

const mockPatients = [
  {
    id: "123A",
    age: 21,
    sex: "Female",
    capFeatures: ["Infiltrate", "Fever", "Cough", "Dyspnoea"],
    contraindications: ["Pregnancy", "Allergies"],
    icuTimings: ["Admit", "Organ Start"],
    consent: "Obtained",
    clinicalState: ["Vasopressors", "PaO/Fio"],
    data: {},
    eligibility: {
      status: "Eligible" as const,
      dateScreened: "00/00/0000",
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  },
  {
    id: "123B",
    age: 30,
    sex: "Male",
    capFeatures: ["Infiltrate", "Fever", "Cough", "Dyspnoea"],
    contraindications: ["Pregnancy", "Allergies"],
    icuTimings: ["Admit", "Organ Start"],
    consent: "Obtained",
    clinicalState: ["Vasopressors", "PaO/Fio"],
    data: {},
    eligibility: {
      status: "Pending" as const,
      dateScreened: "01/01/2025",
      reason: "Awaiting lab results.",
    },
  },
];

export async function GET() {
  return NextResponse.json(mockPatients);

  const api = `${process.env.NEXT_PUBLIC_API_URL}/patient`;
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
