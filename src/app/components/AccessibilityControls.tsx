import { Sun, Moon, Plus, Minus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { motion } from 'motion/react';

export function AccessibilityControls() {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();

  return (
    <motion.div 
      className="fixed top-4 right-4 z-40 bg-card border border-border rounded-2xl p-3 shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
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
  );
}
