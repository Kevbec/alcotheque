export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="dark:bg-white dark:bg-opacity-90 dark:rounded-lg dark:p-1">
        <img 
          src="/custom-logo.png" 
          alt="alcothèque" 
          className="h-10 w-auto object-contain"
        />
      </div>
      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        alcothèque
      </span>
    </div>
  );
}