import { Plant } from '../data/mockData';
import { Link } from 'react-router';
import { StarRating } from './StarRating';
import { Heart, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { requireAuth } = useAuth();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth()) {
      setIsLiked(!isLiked);
    } else {
      alert('Debes iniciar sesión para dar like');
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
              src={plant.images[0]} 
              alt={plant.name}
              className="w-full h-full object-cover"
            />
            <motion.button
              onClick={handleLike}
              className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full backdrop-blur-sm"
              whileTap={{ scale: 0.9 }}
              aria-label="Me gusta"
            >
              <Heart 
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
              />
            </motion.button>
          </div>
          
          <div className="p-4">
            <h3 className="mb-1">{plant.name}</h3>
            <p className="text-sm text-muted-foreground italic mb-2">
              {plant.scientificName}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {plant.shortDescription}
            </p>
            
            <div className="flex items-center justify-between">
              <StarRating 
                rating={plant.rating} 
                totalRatings={plant.totalRatings}
                readonly
                size="sm"
              />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{plant.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
