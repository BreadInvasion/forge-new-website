import { createContext, useContext, useState } from "react";

const ToggleContext = createContext({
    highlight: false,
    showHighlight: (value: boolean) => {},
});

export const useToggle = () => useContext(ToggleContext);

export const ToggleProvider = ({ children }: { children: React.ReactNode }) => {
    const [highlight, showHighlight] = useState(false);
  
    return (
      <ToggleContext.Provider value={{ highlight, showHighlight }}>
        {children}
      </ToggleContext.Provider>
    );
  };