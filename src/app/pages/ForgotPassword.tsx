import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretCode, setSecretCode] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // 🔥 1. verificar si existe el correo en tu BD
  const { data, error } = await supabase
    .from("perfiles")
    .select("email")
    .eq("email", email)
    .single();

  if (error || !data) {
    alert("El correo no existe ❌");
    setIsLoading(false);
    return;
  }

  // 🔥 2. enviar correo de recuperación
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/#/reset-password'
  });

  if (resetError) {
    console.error(resetError);
    alert("Error al enviar recuperación ❌");
    setIsLoading(false);
    return;
  }

  // 🔥 3. mostrar mensaje de éxito
  setIsLoading(false);
  setIsSubmitted(true);
};


  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4">

        {/* FONDO */}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-card rounded-3xl shadow-lg border border-border p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="mb-2">Correo Enviado</h2>
            <p className="text-muted-foreground mb-6">
              Te hemos enviado un enlace para restablecer tu contraseña a{' '}
              <span className="text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">

      {/* FONDO */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://ezrviryjunnzpdfsuxbz.supabase.co/storage/v1/object/public/images/bg-auth.jpg')"
        }}
      ></div>

      {/*  OSCURECER */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 backdrop-blur-[2px]"></div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="relative bg-primary text-primary-foreground p-6">
            <Link
              to="/login"
              className="absolute top-4 left-4 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3 mb-2 justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h1 className="text-2xl">HAMPIYURA</h1>
            </div>
          </div>

          <div className="p-6">
            <h2 className="mb-2">Recuperar Contraseña</h2>
            <p className="text-muted-foreground mb-6">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Enviando...' : 'Enviar Enlace'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Volver a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
