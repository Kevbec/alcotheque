import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  iconOnly?: boolean;
  className?: string;
}

export default function ActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className = ''
}: ActionButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md transition-colors";
  const sizeClasses = size === 'sm' 
    ? "p-2 text-sm" 
    : "px-4 py-2";
  const variantClasses = variant === 'primary' 
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600";

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      title={iconOnly ? label : undefined}
    >
      <Icon className={`w-6 h-6 ${!iconOnly && label ? "mr-2" : ""}`} />
      {!iconOnly && label}
    </button>
  );
}