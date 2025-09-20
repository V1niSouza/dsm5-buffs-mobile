import React, { createContext, useContext, useState, ReactNode } from "react";

interface PropriedadeContextProps {
  propriedadeSelecionada: number | null;
  setPropriedadeSelecionada: (id: number | null) => void;
}

const PropriedadeContext = createContext<PropriedadeContextProps | undefined>(undefined);

export const PropriedadeProvider = ({ children }: { children: ReactNode }) => {
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<number | null>(null);
  
  return (
    <PropriedadeContext.Provider value={{ propriedadeSelecionada, setPropriedadeSelecionada }}>
      
      {children}
    </PropriedadeContext.Provider>
  );
};

export const usePropriedade = () => {
  const context = useContext(PropriedadeContext);
  if (!context) {
    throw new Error("usePropriedade deve ser usado dentro de um PropriedadeProvider");
  }
  return context;
};
