import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthContextType, User } from '../types/auth';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNotification } from './NotificationContext';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const mappedUser: User = {
          id: user.uid,
          email: user.email!,
          name: user.displayName || user.email!.split('@')[0],
          picture: user.photoURL || undefined,
          role: 'user',
        };
        dispatch({ type: 'AUTH_SUCCESS', payload: mappedUser });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const mappedUser: User = {
        id: user.uid,
        email: user.email!,
        name: user.displayName || user.email!.split('@')[0],
        picture: user.photoURL || undefined,
        role: 'user',
      };

      dispatch({ type: 'AUTH_SUCCESS', payload: mappedUser });
      showNotification('Successfully signed in!', 'success');
    } catch (error) {
      const errorMessage = (error as Error).message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      showNotification(errorMessage, 'error');
    }
  }, [showNotification]);

  const login = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      await loginWithGoogle();
    } catch (error) {
      const errorMessage = (error as Error).message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      showNotification(errorMessage, 'error');
    }
  }, [loginWithGoogle]);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      await signOut(auth);
      dispatch({ type: 'AUTH_LOGOUT' });
      showNotification('Successfully signed out!', 'success');
    } catch (error) {
      const errorMessage = (error as Error).message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      showNotification(errorMessage, 'error');
    }
  }, [showNotification]);

  const refreshToken = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      // TODO: Implement token refresh logic
      dispatch({ type: 'AUTH_SUCCESS', payload: state.user! });
    } catch (error) {
      const errorMessage = (error as Error).message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      showNotification(errorMessage, 'error');
    }
  }, [state.user, showNotification]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
