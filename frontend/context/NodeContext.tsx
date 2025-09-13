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
}

const NodeContext = createContext<NodeContextProps>({
  setNoteForm: () => {},
});

export const useNodes = () => useContext(NodeContext);

export function NodeProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState({});
  const { initType, initForm } = form as any;

  return (
    <NodeContext.Provider
      value={{
        initType,
        initForm,
        setNoteForm: setForm,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
}
