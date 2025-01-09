import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

export default function StarRating({ value = 0, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue === value ? 0 : starValue)}
            className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <Star
              className={`w-6 h-6 ${
                starValue <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}