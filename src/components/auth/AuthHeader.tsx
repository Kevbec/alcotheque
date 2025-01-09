export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 dark:bg-white dark:bg-opacity-90 dark:rounded-lg dark:p-1">
        <img 
          src="/custom-logo.png" 
          alt="alcothèque" 
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="mt-4 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
        alcothèque
      </h1>
    </div>
  );
}