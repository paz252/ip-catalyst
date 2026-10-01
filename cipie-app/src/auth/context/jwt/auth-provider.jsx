import { jwtDecode } from 'jwt-decode';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { getRefreshToken } from './action';
import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
import { startTokenRefresh, stopTokenRefresh } from './tokenRefresher';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      let accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      let validToken = accessToken && isValidToken(accessToken);

      // 🔥 Try refresh if token expired
      if (!validToken && accessToken) {
        try {
          await getRefreshToken(); // 🔥 try refresh
          accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
          validToken = accessToken && isValidToken(accessToken);
        } catch {
          accessToken = null;
          validToken = false;
        }
      }


      if (validToken) {
        const finalToken = sessionStorage.getItem(JWT_STORAGE_KEY);

        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);

        const { data } = res;

        const decoded = jwtDecode(finalToken);

        setState({
          user: {
            id: decoded.sub,
            email: data.email,
            role: data.userTypeCode ?? 'user',
            accessToken,
          },
          loading: false,
        });

        startTokenRefresh();

      } else {
        stopTokenRefresh();
        setSession(null);
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      stopTokenRefresh();
      setSession(null);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    return () => {
      stopTokenRefresh();
    };
  }, [checkUserSession]);


  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
