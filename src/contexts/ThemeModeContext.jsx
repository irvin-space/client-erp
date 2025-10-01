import React, { createContext, useContext, useState, useMemo } from 'react';
// Eliminamos imports de MUI ThemeProvider y createTheme

// 1. Crea el Contexto
const ThemeModeContext = createContext();

// 2. Crea el Proveedor (Provider) del Contexto
export function ThemeModeProvider({ children }) {
  // Aquí puedes usar localStorage para inicializar el tema si lo deseas
  const [mode, setMode] = useState('light'); 

  const onChangeMode = (newMode) => {
    setMode(newMode);
  };

  const contextValue = useMemo(() => ({
    mode,
    onChangeMode,
  }), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {/* ¡NO DEBE HABER ThemeProvider AQUÍ! */}
      {children}
    </ThemeModeContext.Provider>
  );
}

// 3. Crea el Hook de Consumo
export default function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    // ESTE ES EL ERROR QUE ESTÁS VIENDO EN CONSOLA
    throw new Error('useThemeMode debe usarse dentro de un ThemeModeProvider');
  }
  return context;
}
