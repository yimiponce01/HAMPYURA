import { Sun, Moon, Plus, Minus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useEffect } from 'react';

export function AccessibilityControls() {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [mostrarBoton, setMostrarBoton] = useState(true);
  const [scrolling, setScrolling] = useState(false);
  const [esDesktop, setEsDesktop] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setScrolling(true);
      setMostrarBoton(false);
      setMostrarPanel(false);

      clearTimeout(timeout);
      clearTimeout(hideTimeout);

      timeout = setTimeout(() => {
        setScrolling(false);
        setMostrarBoton(true);

        hideTimeout = setTimeout(() => {
          setMostrarBoton(false);
        }, 5000);

      }, 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setEsDesktop(window.innerWidth >= 768);
    };

    checkScreen(); // al cargar

    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <>
      {!esDesktop && mostrarBoton && !mostrarPanel && (
        <button
          onClick={() => setMostrarPanel(true)}
          className="md:hidden fixed bottom-20 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg"
        >
          ⚙️
        </button>
      )}

      <motion.div
        className="md:block fixed top-4 right-4 z-40 bg-card border border-border rounded-2xl p-3 shadow-lg"
        animate={{
          x: esDesktop ? 0 : (mostrarPanel && !scrolling ? 0 : 200),
          opacity: esDesktop ? 1 : (mostrarPanel && !scrolling ? 1 : 0)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >

        <div className="flex flex-col gap-3">
          {/* Modo claro/oscuro */}
          <motion.button
            onClick={toggleTheme}
            className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full hover:bg-accent transition-colors"
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? (
              <Sun className="w-6 h-6 text-primary" />
            ) : (
              <Moon className="w-6 h-6 text-primary" />
            )}
          </motion.button>

          {/* Divisor */}
          <div className="w-full h-px bg-border" />

          {/* Controles de zoom de texto */}
          <div className="flex flex-col gap-2">
            <motion.button
              onClick={increaseFontSize}
              className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
              disabled={fontSize >= 24}
              aria-label="Aumentar tamaño de texto"
            >
              <Plus className="w-5 h-5 text-primary" />
            </motion.button>

            <motion.button
              onClick={decreaseFontSize}
              className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
              disabled={fontSize <= 12}
              aria-label="Disminuir tamaño de texto"
            >
              <Minus className="w-5 h-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
