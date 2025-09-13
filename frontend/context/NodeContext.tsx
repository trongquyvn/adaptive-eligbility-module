"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface NodeContextProps {
  initType?: any;
  initForm?: Record<string, any>;
  setNoteForm: any;
  setVariableForm: any;
  initVariableForm?: Record<string, any>;
}

const NodeContext = createContext<NodeContextProps>({
  setNoteForm: () => {},
  setVariableForm: () => {},
});

export const useNodes = () => useContext(NodeContext);

export function NodeProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState({});
  const { initType, initForm } = form as any;
  const [variableForm, setVariableForm] = useState();

  return (
    <NodeContext.Provider
      value={{
        initType,
        initForm,
        setNoteForm: setForm,
        initVariableForm: variableForm,
        setVariableForm,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
}
