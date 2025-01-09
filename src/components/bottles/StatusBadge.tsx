import { Bottle } from '../../types/bottle';
import { getStatusColor, getStatusLabel } from '../../utils/statusColors';

interface StatusBadgeProps {
  status: Bottle['status'];
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { bg, text } = getStatusColor(status);
  
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${bg} ${text} ${className}
    `}>
      {getStatusLabel(status)}
    </span>
  );
}