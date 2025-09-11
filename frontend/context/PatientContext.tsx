"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface PatientContextProps {
  patients: any[];
  rule: Record<string, any>;
  rules: Record<string, any>[];
  addRule: (e: Record<string, any>) => void;
  setActiveRule: Dispatch<SetStateAction<number>>;
  activeRule: number;
  updateActiveRule: (e: Record<string, any>) => void;
}

const PatientContext = createContext<PatientContextProps>({
  patients: [],
  rule: {},
  rules: [],
  addRule: () => {},
  setActiveRule: () => {},
  updateActiveRule: () => {},
  activeRule: 0,
});

export const usePatients = () => useContext(PatientContext);

export function PatientProvider({
  patients,
  rules,
  children,
}: {
  patients: any[];
  rules: Record<string, any>[];
  children: React.ReactNode;
}) {
  const [listRules, setListRules] = useState(rules);
  const [activeRule, setActiveRule] = useState(0);
  const rule = listRules[activeRule] || {};

  const updateActiveRule = (rule: Record<string, any>) => {
    const newList = listRules.map((e) => (e._id === rule._id ? rule : e));
    setListRules(newList);
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        rule,
        activeRule,
        rules: listRules,
        setActiveRule,
        addRule: (rule) => {
          setListRules((prev) => [...prev, rule]);
        },
        updateActiveRule,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}
