"use client";

import { createContext, useContext } from "react";

interface PatientContextProps {
  patients: any[];
  rule: Record<string, any>;
}

const PatientContext = createContext<PatientContextProps>({
  patients: [],
  rule: {},
});

export const usePatients = () => useContext(PatientContext);

export function PatientProvider({
  patients,
  rule,
  children,
}: {
  patients: any[];
  rule: Record<string, any>;
  children: React.ReactNode;
}) {
  return (
    <PatientContext.Provider value={{ patients, rule }}>
      {children}
    </PatientContext.Provider>
  );
}
