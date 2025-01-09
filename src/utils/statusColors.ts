// Définition des couleurs de statut en tons de bleu
export const getStatusColor = (status: string) => {
  const colors = {
    en_stock: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/50',
      text: 'text-indigo-800 dark:text-indigo-200'
    },
    ouverte: {
      bg: 'bg-indigo-200 dark:bg-indigo-800/50',
      text: 'text-indigo-900 dark:text-indigo-300'
    },
    consommee: {
      bg: 'bg-indigo-300 dark:bg-indigo-700/50',
      text: 'text-indigo-900 dark:text-indigo-300'
    },
    offerte: {
      bg: 'bg-indigo-400 dark:bg-indigo-600/50',
      text: 'text-indigo-900 dark:text-indigo-300'
    }
  };

  return colors[status as keyof typeof colors] || colors.en_stock;
};

export const getStatusLabel = (status: string) => {
  const labels = {
    en_stock: 'En Stock',
    ouverte: 'Ouverte',
    consommee: 'Finie',
    offerte: 'Offerte'
  };

  return labels[status as keyof typeof labels] || status;
};