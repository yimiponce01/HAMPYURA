import { Link } from 'react-router-dom';
import { Heart, Eye, Star } from "lucide-react";
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "../../lib/supabase";

// ✅ TYPE
type Plant = {
  id: string;
  nombre_planta: string;
  nombre_cientifico?: string;
  descripcion: string;
  imagenes: string[];
  propiedades?: string[];
  enfermedades?: string[];
  preparacion?: string[];
  likesCount?: number;
  vistasCount?: number;
  ratingPromedio?: number;
};

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const { userLikes, setUserLikes } = useAuth();

  // ✅ estado real del like (rápido y correcto)
  const isLiked = userLikes.includes(plant.id);

  // 🔥 LIKE INSTANTÁNEO
  const toggleLike = async (e: React.MouseEvent) => {
    window.dispatchEvent(new Event("likesUpdated"));
    e.preventDefault();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    // ❌ si no está logeado
    if (!user) {
      alert("Debes iniciar sesión para dar like ❌");
      return;
    }

    // ⚡ cambio inmediato (sin delay)
    if (isLiked) {
      setUserLikes(prev => prev.filter(id => id !== plant.id));
    } else {
      setUserLikes(prev => [...prev, plant.id]);
    }

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("publicacion_id", plant.id);
      } else {
        await supabase.from("likes").insert({
          user_id: user.id,
          publicacion_id: plant.id
        });
      }
    } catch (error) {
      console.error("Error en like:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/plant/${plant.id}`} className="block">
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border">
          
          {/* 📷 IMAGEN */}
          <div className="relative h-48 overflow-hidden bg-secondary">
            <img 
              src={plant.imagenes?.[0] || "https://via.placeholder.com/400x300"}
              alt={plant.nombre_planta}
              className="w-full h-full object-cover"
            />

            {/* ❤️ LIKE */}
            <div 
              onClick={toggleLike}
              className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 px-3 py-2 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-100 ${
                  isLiked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-muted-foreground"
                }`}
              />

              <span className="text-xs font-medium text-foreground">
                {plant.likesCount || 0}
              </span>
            </div>
          </div>

          {/* 📄 CONTENIDO */}
          <div className="p-4">
            <h3 className="mb-1">{plant.nombre_planta}</h3>

            <p className="text-sm text-muted-foreground italic mb-2">
              {plant.nombre_cientifico || "Sin nombre científico"}
            </p>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {plant.descripcion}
            </p>

            <div className="flex items-center justify-between mt-2 text-sm">

              {/* ⭐ RATING */}
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(plant.ratingPromedio || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* 👁️ VISTAS */}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                <span>{plant.vistasCount || 0}</span>
              </div>

            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}