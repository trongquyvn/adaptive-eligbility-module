"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface PatientContextProps {
  ruleUpdate: number;
  patients: any[];
  rule: Record<string, any>;
  rules: Record<string, any>[];
  logs: Record<string, any>[];
  addRule: (e: Record<string, any>) => void;
  setActiveRule: Dispatch<SetStateAction<number>>;
  activeRule: number;
  updateActiveRule: (e: Record<string, any>) => void;
  addPatient: (e: Record<string, any>) => void;
  updateActivePatient: (e: Record<string, any>) => void;
  activeDataKey: string;
}

const PatientContext = createContext<PatientContextProps>({
  ruleUpdate: 0,
  patients: [],
  rule: {},
  rules: [],
  logs: [],
  addPatient: () => {},
  addRule: () => {},
  setActiveRule: () => {},
  updateActiveRule: () => {},
  updateActivePatient: () => {},
  activeRule: 0,
  activeDataKey: "",
});

export const usePatients = () => useContext(PatientContext);

export function PatientProvider({
  patients,
  rules,
  logs,
  children,
}: {
  patients: any[];
  rules: Record<string, any>[];
  logs: Record<string, any>[];
  children: React.ReactNode;
}) {
  const [listPatients, setListPatients] = useState(patients);
  const [listRules, setListRules] = useState(rules);

  const [activeRule, setActiveRule] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeRule");
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  const [ruleUpdate, setRuleUpdate] = useState(0);
  const rule = listRules[activeRule] || {};
  const activeDataKey = rule?.trial?.id + "_" + rule?.trial?.version;

  useEffect(() => {
    if (activeRule >= listRules.length) {
      setActiveRule(0);
      localStorage.setItem("activeRule", "0");
    } else {
      localStorage.setItem("activeRule", String(activeRule));
    }
  }, [activeRule, listRules]);

  const updateActiveRule = (rule: Record<string, any>) => {
    const newList = listRules.map((e) => (e._id === rule._id ? rule : e));
    setListRules(newList);
    setRuleUpdate((prev) => prev + 1);
  };

  const addPatient = (patient: any) => {
    setListPatients((prev) => [...prev, patient]);
  };

  const updateActivePatient = (patient: any) => {
    const newList = listPatients.map((e) =>
      e._id === patient._id ? patient : e
    );
    setListPatients(newList);
  };

  return (
    <PatientContext.Provider
      value={{
        ruleUpdate,
        patients: listPatients,
        rule,
        activeRule,
        rules: listRules,
        activeDataKey,
        setActiveRule: (e) => {
          setActiveRule(e);
          setRuleUpdate((prev) => prev + 1);
        },
        addRule: (rule) => {
          setListRules((prev) => [...prev, rule]);
        },
        updateActiveRule,
        addPatient,
        updateActivePatient,
        logs,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}
