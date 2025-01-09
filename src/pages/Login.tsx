import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import AuthHeader from '../components/auth/AuthHeader';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <LoginForm />
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Pas encore de compte ?{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}