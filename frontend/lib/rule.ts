import { API_BASE_URL } from "@/constants";

export async function updateRule(id: any, body: any) {
  console.log('id: ', id);
  const res = await fetch(`${API_BASE_URL}/api/roadmap/${id}`, {
    method: "PUT",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to save Rule");
  return res.json();
}
