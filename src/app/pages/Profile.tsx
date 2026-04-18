import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from "sonner"; 


export default function Profile() {

  const { user, isAuthenticated, logout } = useAuth();
  const [userPlants, setUserPlants] = useState<any[]>([]);
  const [misPublicaciones, setMisPublicaciones] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<string | null>(null);
  const totalRatings = userPlants.reduce((acc, p) => acc + (p.ratingPromedio || 0), 0);
  const promedioGeneral = userPlants.length > 0 ? totalRatings / userPlants.length : 0;
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // 🔥 1. TRAER PERFIL
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setPerfil(data);
      } else {
        console.error("Error perfil:", error);
      }
    };

    // 🔥 2. TRAER PLANTAS
    const fetchUserPlants = async () => {
      const { data, error } = await supabase
        .from("publicaciones")
        .select(`
          *,
          likes(count),
          vistas(count),
          ratings(rating)
        `)
        .eq("user_id", user.id)
        .eq("estado", "aprobado")
        .order("created_at", { ascending: false });

      if (!error) {
        const plantsWithStats = (data || []).map((plant: any) => {
          const likes = plant.likes?.[0]?.count || 0;
          const vistas = plant.vistas?.[0]?.count || 0;

          const ratingsArray = Array.isArray(plant.ratings) ? plant.ratings : [];
          const promedio =
            ratingsArray.length > 0
              ? ratingsArray.reduce((acc: number, r: any) => acc + r.rating, 0) /
                ratingsArray.length
              : 0;


          return {
            ...plant,
            likesCount: likes,
            vistasCount: vistas,
            ratingPromedio: promedio,
          };
        });

        setUserPlants(plantsWithStats);
      } else {
        console.error(error);
      }
    };

    // 🔥 EJECUTAR TODO
    fetchPerfil();
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

  
    const toggleMenu = (id: string) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const editarPublicacion = (plant: any) => {
    setPlantToEdit(plant);
    setShowEditModal(true);
  };

const eliminarPublicacion = async (id: string) => {
  const confirmDelete = confirm("¿Eliminar publicación?");
  if (!confirmDelete) return;

  const { error } = await supabase
    .from("publicaciones")
    .delete()
    .eq("id", id);

  if (!error) {
    setMisPublicaciones(prev => prev.filter(p => p.id !== id));
  }
};

const confirmarEliminacion = async () => {
  if (!plantToDelete) return;

  const { error } = await supabase
    .from("publicaciones")
    .delete()
    .eq("id", plantToDelete);

  if (!error) {
    setMisPublicaciones(prev =>
      prev.filter(p => p.id !== plantToDelete)
    );

    setUserPlants((prev) =>
      prev.filter((p) => p.id !== plantToDelete)
    );

    setShowDeleteModal(false);
    setPlantToDelete(null);

    toast.success("Publicación eliminada 🗑️");
  }
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
              {perfil?.foto_url ? (
                <img
                  src={perfil.foto_url}
                  alt={perfil?.nombre || user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="mb-1">{perfil?.nombre || user.name}</h2>
              <p className="text-primary-foreground/80">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  Administrador
                </span>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-primary-foreground/90">{perfil?.bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-4 bg-card rounded-2xl shadow-lg border border-border p-4">

          {/* 📦 PUBLICACIONES */}
          <div className="text-center">
            <div className="text-2xl mb-1">{userPlants.length}</div>
            <div className="text-sm text-muted-foreground">Publicaciones</div>
          </div>

          {/* ❤️ LIKES + 👁️ VISTAS */}
          <div className="text-center">
            <div className="text-2xl mb-1">
              {userPlants.reduce((acc, p) => acc + (p.likesCount || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Me gusta</div>

            
          </div>

          {/* ⭐ PROMEDIO */}
          <div className="text-center">
            <div className="text-2xl mb-1">
              {promedioGeneral.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Rating</div>
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
                className="bg-card rounded-xl overflow-visible border border-border hover:shadow-md transition-shadow"
              >
                <div className="h-32 overflow-hidden bg-secondary">
                  <img
                    src={plant.imagenes?.[0] || "https://via.placeholder.com/300"}
                    alt={plant.nombre_planta}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h4 className="mb-1">{plant.nombre_planta}</h4>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plant.descripcion}
                  </p>

                  <div className="flex items-center justify-between mt-2">

                  {/* IZQUIERDA */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>❤️ {plant.likesCount || 0}</span>
                    <span>👁️ {plant.vistasCount || 0}</span>
                    <span>⭐ {plant.ratingPromedio?.toFixed(1) || "0.0"}</span>
                  </div>
                  
                  {/* DERECHA (3 puntitos) */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();     // 🚫 evita que el Link navegue
                        e.stopPropagation();    // 🚫 evita que el click suba al Link
                        toggleMenu(plant.id);
                      }}
                      className="p-2 rounded-full hover:bg-secondary"
                    >
                      ⋮
                    </button>

                    {menuOpen === plant.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-36 bg-card border border-border rounded-xl shadow-xl z-[999]">
                        
                        <button
                            onClick={(e) => {
                              e.preventDefault(); // 🚫 evita que el Link navegue
                              e.stopPropagation();
                              navigate(`/edit/${plant.id}`);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-secondary text-sm text-black-500"
                          >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPlantToDelete(plant.id);
                            setShowDeleteModal(true);
                          }}
                          className="block w-full text-left px-3 py-2 hover:bg-secondary text-sm text-red-500"
                        >
                          🗑 Eliminar
                        </button>

                      </div>
                    )}
                  </div>

                </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      

      {/* MODAL ELIMINAR */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-card p-6 rounded-2xl w-[320px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2">¿Eliminar publicación?</h3>

            <p className="text-sm text-muted-foreground mb-4">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:bg-muted"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Eliminar
              </button>

            </div>
          </div>
        </div>

        
      )}
    </div>
  );
}
