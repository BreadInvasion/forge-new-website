import React, { createContext, useContext, useState } from 'react';

interface HighlightContextProps {
    highlight: boolean;
    setHighlight: React.Dispatch<React.SetStateAction<boolean>>;
}

const HighlightContext = createContext<HighlightContextProps | undefined>(undefined);

export const HighlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [highlight, setHighlight] = useState(false);

    return (
        <HighlightContext.Provider value={{ highlight, setHighlight }}>
            {children}
        </HighlightContext.Provider>
    );
};

export const useHighlight = () => {
    const context = useContext(HighlightContext);
    if (!context) {
        throw new Error('useHighlight must be used within a HighlightProvider');
    }
    return context;
};