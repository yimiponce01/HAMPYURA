import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    // Cargar tamaño de fuente del localStorage
    const savedFontSize = localStorage.getItem('hampiyura_font_size');
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.setProperty('--font-size', `${size}px`);
    }
  }, []);

  const increaseFontSize = () => {
    setFontSize(prev => {
      const newSize = Math.min(prev + 2, MAX_FONT_SIZE);
      document.documentElement.style.setProperty('--font-size', `${newSize}px`);
      localStorage.setItem('hampiyura_font_size', newSize.toString());
      return newSize;
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => {
      const newSize = Math.max(prev - 2, MIN_FONT_SIZE);
      document.documentElement.style.setProperty('--font-size', `${newSize}px`);
      localStorage.setItem('hampiyura_font_size', newSize.toString());
      return newSize;
    });
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
    document.documentElement.style.setProperty('--font-size', `${DEFAULT_FONT_SIZE}px`);
    localStorage.setItem('hampiyura_font_size', DEFAULT_FONT_SIZE.toString());
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility debe ser usado dentro de un AccessibilityProvider');
  }
  return context;
}
