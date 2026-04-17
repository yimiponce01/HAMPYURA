import { Link } from 'react-router-dom';
import { StarRating } from './StarRating';
import { Heart, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from "sonner";

// ✅ TYPE ARRIBA
type Plant = {
  id: string;
  nombre_planta: string;
  nombre_cientifico?: string;
  descripcion: string;
  imagenes: string[];
  propiedades?: string[];
  enfermedades?: string[];
  preparacion?: string[];
  likes?: number;
};

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { requireAuth } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!requireAuth()) {
    toast.error("Debes iniciar sesión para dar like 🔒", {
      description: "Inicia sesión para interactuar con las plantas 🌿",
    });
    return;
  }

  const nuevoLike = !isLiked;
  setIsLiked(nuevoLike);

  const nuevosLikes = nuevoLike
    ? (plant.likes || 0) + 1
    : (plant.likes || 0) - 1;

  const { error } = await supabase
    .from("publicaciones")
    .update({ likes: nuevosLikes })
    .eq("id", plant.id);

  if (error) {
    console.error("Error al dar like:", error);
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
          
          <div className="relative h-48 overflow-hidden bg-secondary">
            <img 
              src={plant.imagenes?.[0] || "https://via.placeholder.com/400x300"}
              alt={plant.nombre_planta}
              className="w-full h-full object-cover"
            />

            <motion.button
              onClick={handleLike}
              className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full backdrop-blur-sm"
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
              />
            </motion.button>
          </div>

          <div className="p-4">
            <h3 className="mb-1">{plant.nombre_planta}</h3>

            <p className="text-sm text-muted-foreground italic mb-2">
              {plant.nombre_cientifico || "Sin nombre científico"}
            </p>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {plant.descripcion}
            </p>

            <div className="flex items-center justify-between">
              <StarRating 
                rating={0}
                totalRatings={0}
                readonly
                size="sm"
              />

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>
                  {(plant.likes || 0) + (isLiked ? 1 : 0)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}