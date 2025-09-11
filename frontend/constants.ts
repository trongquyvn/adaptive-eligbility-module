export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://adaptive-eligbility-module.vercel.app";

export const API_CALL_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://adaptive-eligbility-module-production.up.railway.app";

export const cateList = [
  { id: "1", name: "ID Check" },
  { id: "2", name: "Platform" },
  { id: "3", name: "Domain" },
  { id: "4", name: "Regimen" },
  { id: "5", name: "Consent" },
];

export const mockPatients = [
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
