import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from "lucide-react";
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { toast } from "sonner";
import { useState, useEffect } from 'react';

export default function ResetPassword() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    const handleSession = async () => {
        const hash = window.location.hash;

        if (!hash) return;

        // 🔥 FIX: manejar doble #
        const hashParts = hash.split('#');

        // siempre el token está al final
        const tokenString = hashParts[hashParts.length - 1];

        const params = new URLSearchParams(tokenString);

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (!access_token || !refresh_token) {
        console.error("No hay tokens en URL ❌");
        console.log("HASH:", hash); // 🔍 debug
        return;
        }

        // 🔥 1. CREAR SESIÓN
        const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
        });

        if (error) {
        console.error("Error seteando sesión:", error);
        return;
        }

        console.log("Sesión restaurada ✅");

        // 🔥 2. VERIFICAR
        const { data } = await supabase.auth.getSession();
        console.log("SESSION:", data);
    };

    handleSession();
    }, []);


    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔥 VALIDACIONES
        if (!password || !confirmPassword) {
        toast.error("Completa los campos ❌");
        return;
        }

        if (password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden ❌");
        return;
        }

        if (password.length < 6) {
        toast.error("Mínimo 6 caracteres ❌");
        return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({
        password: password
        });

        setIsLoading(false);

        if (error) {
        toast.error("Error al cambiar contraseña ❌");
        console.error(error);
        return;
        }

        // ✅ MENSAJE BONITO
        toast.success("Contraseña actualizada correctamente ✅");

        // 🔥 REDIRIGIR
        setTimeout(() => {
        navigate('/login');
        }, 1500);
    };

    

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">

        {/* FONDO IGUAL QUE LOGIN */}
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

            {/* HEADER IGUAL */}
            <div className="bg-primary text-primary-foreground p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                </div>
                <h1 className="text-2xl">HAMPIYURA</h1>
                </div>
                <p className="text-primary-foreground/80">
                Nueva contraseña
                </p>
            </div>

            {/* FORM */}
            <div className="p-6">

                <h2 className="mb-4 text-center">Cambiar contraseña</h2>

                <form onSubmit={handleChangePassword} className="space-y-4">

                {/* PASSWORD */}
                <div>
                    <label className="block mb-2">Nueva contraseña</label>

                    <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                {/* CONFIRM PASSWORD */}
                <div>
                    <label className="block mb-2">Confirmar contraseña</label>

                    <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="••••••••"
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                {/* BUTTON */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </motion.button>

                </form>
            </div>
            </div>
        </motion.div>
        </div>
    );
}