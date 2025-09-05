import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { PatientProvider } from "@/context/PatientContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

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

async function getPatients() {
  // const res = await fetch(`${process.env.API_URL}/patients`, {
  //   cache: "no-store", // hoặc "force-cache" tùy use case
  // });
  // if (!res.ok) throw new Error("Failed to fetch patients");
  // return res.json();
  return [];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const patients = await getPatients();

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
