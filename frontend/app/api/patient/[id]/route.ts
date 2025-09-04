import { NextResponse } from "next/server";

// mock data
const mockPatients = {
  "123A": {
    id: "123A",
    age: 21,
    sex: "Female",
    capFeatures: ["Infiltrate", "Fever", "Cough", "Dyspnoea"],
    contraindications: ["Pregnancy", "Allergies"],
    icuTimings: ["Admit", "Organ Start"],
    consent: "Obtained",
    clinicalState: ["Vasopressors", "PaO/Fio"],
    eligibility: {
      status: "Eligible" as const,
      dateScreened: "00/00/0000",
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  },
  "123B": {
    id: "123B",
    age: 30,
    sex: "Male",
    capFeatures: ["Fever", "Cough"],
    contraindications: ["None"],
    icuTimings: ["Admit"],
    consent: "Pending",
    clinicalState: ["Stable"],
    eligibility: {
      status: "Pending" as const,
      dateScreened: "01/01/2025",
      reason: "Awaiting lab results.",
    },
  },
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('request: ', request); 
  console.log('params.id: ', params.id);
  const patient = mockPatients[params.id as keyof typeof mockPatients];
  console.log('patient: ', patient);

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json(patient);
}
