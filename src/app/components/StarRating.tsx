import { Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, totalRatings, onRate, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = (hoverRating || rating) >= star;
          return (
            <motion.button
              key={star}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
              onClick={() => handleClick(star)}
              className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
              disabled={readonly}
              whileTap={!readonly ? { scale: 0.9 } : {}}
              aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
            >
              <Star 
                className={`${sizeClasses[size]} ${filled ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
              />
            </motion.button>
          );
        })}
      </div>
      {totalRatings !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({totalRatings})
        </span>
      )}
    </div>
  );
}
