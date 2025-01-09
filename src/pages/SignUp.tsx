import { Link } from 'react-router-dom';
import SignUpForm from '../components/auth/SignUpForm';
import AuthHeader from '../components/auth/AuthHeader';

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <SignUpForm />
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}