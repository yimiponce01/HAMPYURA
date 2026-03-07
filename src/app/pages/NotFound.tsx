import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-8xl mb-6">🌿</div>
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link 
          to="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Volver al Inicio
        </Link>
      </motion.div>
    </div>
  );
}
