import { Star } from 'lucide-react';
import { Bottle } from '../../types/bottle';

interface BottleRatingProps {
  rating?: number;
  comments?: string;
}

export default function BottleRating({ rating, comments }: BottleRatingProps) {
  if (!rating && !comments) return null;

  return (
    <div className="space-y-3">
      {rating && (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`w-5 h-5 ${
                  value <= rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating}/5</span>
        </div>
      )}
      
      {comments && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {comments}
        </div>
      )}
    </div>
  );
}