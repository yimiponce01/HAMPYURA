import { motion } from 'motion/react';
import { X, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export function WelcomeVisitorModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar solo si es visitante y no ha visto el modal antes
    const hasSeenWelcome = localStorage.getItem('hampiyura_welcome_seen');
    if (!hasSeenWelcome) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hampiyura_welcome_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleClose}
    >
      <motion.div 
        className="bg-card rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-primary text-primary-foreground p-8 text-center">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10" />
          </div>
          <h1 className="text-2xl mb-2">Bienvenido a HAMPIYURA</h1>
          <p className="text-primary-foreground/90">
            Tu guía para el mundo de las plantas medicinales
          </p>
        </div>

        <div className="p-6">
          <h3 className="mb-4">Como visitante puedes:</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">🌿</span>
              <span className="text-muted-foreground">Ver y buscar plantas medicinales</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">🔍</span>
              <span className="text-muted-foreground">Buscar por enfermedad o síntoma</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">📚</span>
              <span className="text-muted-foreground">Leer artículos educativos</span>
            </li>
          </ul>

          <div className="p-4 bg-secondary rounded-xl mb-6">
            <h4 className="mb-2">¿Quieres más?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Crea una cuenta para publicar plantas, comentar y participar en la comunidad
            </p>
            <Link 
              to="/register"
              className="block w-full bg-primary text-primary-foreground py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
              onClick={handleClose}
            >
              Crear Cuenta Gratis
            </Link>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2 text-muted-foreground hover:text-foreground"
          >
            Continuar explorando
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
