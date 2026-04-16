import { Home, Camera, User, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { useState } from 'react';

export function MobileNavigation() {
  const location = useLocation();
  const { isAuthenticated, requireAuth } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handlePublishClick = (e: React.MouseEvent) => {
    if (!requireAuth()) {
      e.preventDefault();
      setShowAuthPrompt(true);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-around h-20 px-4">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all ${
              isActive('/') ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Inicio</span>
          </Link>

          <Link 
            to="/publish"
            onClick={handlePublishClick}
            className="flex flex-col items-center justify-center w-20 h-20 -mt-8 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Camera className="w-8 h-8" />
          </Link>

          <Link 
            to="/profile" 
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all ${
              isActive('/profile') ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </motion.nav>

      {/* Prompt para iniciar sesión */}
      {showAuthPrompt && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAuthPrompt(false)}
        >
          <motion.div 
            className="bg-card rounded-2xl p-6 max-w-sm w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">Inicia sesión para publicar</h3>
              <button onClick={() => setShowAuthPrompt(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground mb-6">
              Necesitas una cuenta para publicar plantas y participar en la comunidad.
            </p>
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                Iniciar sesión
              </Link>
              <button 
                onClick={() => setShowAuthPrompt(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
