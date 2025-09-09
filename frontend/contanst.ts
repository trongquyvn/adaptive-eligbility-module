export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://adaptive-eligbility-module.vercel.app";

export const cateList = [
  { id: "1", name: "ID Check" },
  { id: "2", name: "Platform" },
  { id: "3", name: "Domain" },
  { id: "4", name: "Regimen" },
  { id: "5", name: "Consent" },
];
