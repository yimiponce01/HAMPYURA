import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, continueAsVisitor } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsVisitor = () => {
    continueAsVisitor();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">

      {/*  FONDO */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://ezrviryjunnzpdfsuxbz.supabase.co/storage/v1/object/public/images/bg-auth.jpg')"
        }}
      ></div>

      {/* OSCURECER */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 backdrop-blur-[2px]"></div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden">
          {/* Header with close button */}
          <div className="relative bg-primary text-primary-foreground p-6">
            <button
              onClick={handleContinueAsVisitor}
              className="absolute top-4 right-4 hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Continuar como visitante"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h1 className="text-2xl">HAMPIYURA</h1>
            </div>
            <p className="text-primary-foreground/80">
              Descubre el poder de las plantas medicinales
            </p>
          </div>

          <div className="p-6">
            <h2 className="mb-2">Iniciar Sesión</h2>
            <p className="text-muted-foreground mb-6">
              Ingresa tus credenciales para continuar
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2">
                  Contraseña
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground mb-4">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">o</span>
                </div>
              </div>

              <motion.button
                onClick={handleContinueAsVisitor}
                className="w-full py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                Continuar como Visitante
              </motion.button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
