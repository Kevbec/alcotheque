export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 dark:bg-white dark:bg-opacity-90 dark:rounded-lg dark:p-1">
        <img 
          src="/custom-logo.png" 
          alt="alcothèque" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        alcothèque
      </span>
    </div>
  );
}
