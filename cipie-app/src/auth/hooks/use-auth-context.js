// import { use } from 'react';
import { useContext } from 'react';

import { AuthContext } from '../context/auth-context';

// ----------------------------------------------------------------------

export function useAuthContext() {
  // const context = use(AuthContext);
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext: Context must be used inside AuthProvider');
  }

  return context;
}
