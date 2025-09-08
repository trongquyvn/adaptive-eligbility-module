import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { PatientProvider } from "@/context/PatientContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { API_BASE_URL } from "@/contanst";
import rule from "@/mockData/rule1.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REMAP-CAP v2.4",
  description: "Adaptive Eligibility Module",
};

async function getRule(id: string = "remap-cap") {
  const res = await fetch(
    `${API_BASE_URL}/api/roadmap/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

async function getPatients() {
  const res = await fetch(`${API_BASE_URL}/api/patient`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [patients] = await Promise.all([getPatients(), getRule()]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ConditionalLayout>
            <PatientProvider patients={patients} rule={rule}>
              {children}
            </PatientProvider>
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
