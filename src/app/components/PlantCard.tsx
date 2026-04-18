import { Link } from 'react-router-dom';
import { Heart, Eye, Star } from "lucide-react";
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';



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
  likesCount?: number;
  vistasCount?: number;
  ratingPromedio?: number;
};

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const { requireAuth } = useAuth();

console.log("PROMEDIO:", plant.ratingPromedio);

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

            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full backdrop-blur-sm">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="p-4">
            <h3 className="mb-1">{plant.nombre_planta}</h3>

            <p className="text-sm text-muted-foreground italic mb-2">
              {plant.nombre_cientifico || "Sin nombre científico"}
            </p>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {plant.descripcion}
            </p><div className="flex items-center justify-between mt-2 text-sm">

            {/* ⭐ ESTRELLAS */}
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

            {/* ❤️ LIKES */}
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{plant.likesCount || 0}</span>
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