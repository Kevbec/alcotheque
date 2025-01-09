import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function UserSettings() {
  const { profile } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        setSuccess("Mot de passe mis à jour avec succès");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setError("Erreur lors de la modification du mot de passe. Veuillez vous reconnecter et réessayer.");
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium mb-6">Profil Utilisateur</h3>
      
      <div className="space-y-6">
        {/* Informations du profil */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Informations personnelles
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prénom
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {profile?.firstName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Changement de mot de passe */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Changer le mot de passe
          </h4>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}