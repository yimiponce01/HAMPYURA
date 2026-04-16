import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';



export default function Profile() {

  const { user, isAuthenticated, logout } = useAuth();
  const [userPlants, setUserPlants] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return; // 🔥 evita error

    const fetchUserPlants = async () => {
      const { data, error } = await supabase
        .from("publicaciones")
        .select("*")
        .eq("user_id", user.id)
        .eq("estado", "aprobado")
        .order("created_at", { ascending: false });

      if (!error) {
        setUserPlants(data || []);
      } else {
        console.error(error);
      }
    };

    fetchUserPlants();
  }, [user]);

  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2">Modo Visitante</h2>
          <p className="text-muted-foreground mb-6">
            Inicia sesión para acceder a tu perfil
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90"
          >
            Iniciar Sesión
          </Link>
        </motion.div>
      </div>
    );
  }


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">

      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">

            {/* IZQUIERDA */}
            <div className="flex flex-col gap-3">

              {/* BOTÓN VOLVER */}
              <button
                onClick={() => navigate('/')}
                className="text-white hover:opacity-80 -ml-2 text-base"
              >
                ← Volver
              </button>

              {/* TÍTULO */}
              <h1 className="text-3xl font-bold tracking-tight">
                Perfil
              </h1>

            </div>

            {/* DERECHA */}
            <div className="flex gap-2">
              <Link
                to="/edit-profile"
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>


          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full overflow-hidden flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="mb-1">{user.name}</h2>
              <p className="text-primary-foreground/80">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  Administrador
                </span>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-primary-foreground/90">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-4 bg-card rounded-2xl shadow-lg border border-border p-4">
          <div className="text-center">
            <div className="text-2xl mb-1">{(userPlants || []).length}</div>
            <div className="text-sm text-muted-foreground">Publicaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">
              {(userPlants || []).reduce((acc, p) => acc + 0, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Me gusta</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">
              {(userPlants || []).reduce((acc, p) => acc + (p.comments || []).length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Comentarios</div>
          </div>
        </div>
      </div>

      {/* Admin Panel Link */}
      {user.role === 'admin' && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <Link
            to="/admin"
            className="block bg-accent text-accent-foreground p-4 rounded-xl hover:bg-accent/80 transition-colors"
          >
            <h3 className="mb-1">Panel de Administrador</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona usuarios, contenido y reportes
            </p>
          </Link>
        </div>
      )}

      {/* User Plants */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mis Publicaciones</h3>

          {/* SOLO en PC y SOLO si hay publicaciones */}
          {userPlants.length > 0 && (
            <Link
              to="/publish"
              className="hidden md:block bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90"
            >
              Publicar Planta
            </Link>
          )}
        </div>

        {userPlants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="mb-2">Aún no has publicado plantas</h3>
            <p className="text-muted-foreground mb-6">
              Comparte tus conocimientos sobre plantas medicinales
            </p>
            <Link
              to="/publish"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90"
            >
              Publicar Planta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userPlants.map((plant) => (
              <Link
                key={plant.id}
                to={`/plant/${plant.id}`}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow"
              >
                <div className="h-32 overflow-hidden bg-secondary">
                  <img
                    src={plant.imagen_url || "https://via.placeholder.com/300"}
                    alt={plant.nombre_planta}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h4 className="mb-1">{plant.nombre_planta}</h4>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plant.descripcion}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">

                    {/* ❤️ likes fake visual */}
                    <span>❤️ 0</span>

                    {/* ⭐ rating visual */}
                    <span>⭐ 5.0</span>

                    {/* 💬 comentarios fake */}
                    <span>💬 0</span>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
