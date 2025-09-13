import { API_BASE_URL } from "@/constants";

export async function updatePatient(id: any, body: any) {
  const safeId = encodeURIComponent(id);
  const res = await fetch(`${API_BASE_URL}/api/patient/${safeId}`, {
    method: "PUT",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to save patient");
  return res.json();
}

export async function runPatientCheck(body: any) {
  const res = await fetch(`${API_BASE_URL}/api/eligibility/`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to eligibility");
  return res.json();
}

export async function getPatientLog(
  id: string,
  ruleId: string,
  version: string
) {
  const safeId = encodeURIComponent(id);
  const safeRule = encodeURIComponent(ruleId);
  const safeVer = encodeURIComponent(version);
  const res = await fetch(`${API_BASE_URL}/api/logs/${safeId}/`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ruleId: safeRule,
      version: safeVer,
    }),
  });

  if (!res.ok) throw new Error("Failed to getPatientLog");
  return res.json();
}
