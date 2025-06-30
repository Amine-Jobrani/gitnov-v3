// -------------------------------------------------------
// src/context/AuthContext.tsx
// -------------------------------------------------------
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';
import { User } from '../types';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type Roles = 'client' | 'organizer' | 'partner';

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: Roles;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  /** `true` uniquement pendant l’initialisation Firebase */
  isLoading: boolean;
}

/* ------------------------------------------------------------------ */
/* Context / hook                                                     */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

interface Props {
  children: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */
export const AuthProvider: React.FC<Props> = ({ children }) => {
  /** Charge uniquement le démarrage – ne change plus ensuite. */
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  /* -------------------------------------------------------------- */
  /* Helpers                                                        */
  /* -------------------------------------------------------------- */
  const mapFirebaseUser = async (fbUser: FirebaseUser): Promise<User> => {
    const idToken = await fbUser.getIdToken();
    
    // Try to fetch user role from backend
    let role: 'client' | 'organizer' | 'partner' | 'admin' = 'client';
    
    try {
      const response = await api.get(`/users/${fbUser.uid}/role`);
      console.log('Backend role response:', response.data); // Debug log
      
      // Handle the backend response structure: { success: true, data: { role: 2, ... } }
      if (response.data && response.data.success && response.data.data && response.data.data.role !== undefined) {
        const roleMap = {
          0: 'client',
          1: 'organizer',
          2: 'partner',
          3: 'admin'
        } as const;
        const numericRole = response.data.data.role;
        role = roleMap[numericRole as keyof typeof roleMap] || 'client';
        console.log(`Mapped role ${numericRole} to ${role}`); // Debug log
      }
    } catch (error) {
      console.warn('Failed to fetch user role from backend, defaulting to client:', error);
      // Default to client if backend call fails
    }
    
    return {
      id: fbUser.uid,
      fullName: fbUser.displayName || '',
      email: fbUser.email || '',
      phoneNumber: fbUser.phoneNumber || '',
      role,
      isEmailVerified: fbUser.emailVerified,
      isPhoneVerified: !!fbUser.phoneNumber,
      createdAt: new Date(fbUser.metadata.creationTime || '').toISOString(),
      updatedAt: new Date(fbUser.metadata.lastSignInTime || '').toISOString(),
      idToken,
    } as User;
  };

  /* -------------------------------------------------------------- */
  /* Auth actions                                                   */
  /* -------------------------------------------------------------- */
  const register = async ({
    fullName,
    email,
    password,
    phoneNumber,
    role,
  }: RegisterData): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await fbUpdateProfile(cred.user, { displayName: fullName });

      const idToken = await cred.user.getIdToken();

      await api.post(
        '/register',
        {
          uid: cred.user.uid,
          name: fullName,
          email,
          phoneNumber,
          role,
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      localStorage.setItem('casavibes_user', JSON.stringify(mapped));
      return true;
    } catch (err: any) {
      console.error('Registration failed:', err);
      throw new Error(err?.code || 'auth/unknown');
    }
  };

  /**
   * IMPORTANT : on ne touche plus à `isLoading` ici.
   * On laisse le composant appelant gérer son propre spinner.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const mapped = await mapFirebaseUser(cred.user);

      await api.get('/me', {
        headers: { Authorization: `Bearer ${mapped.idToken}` },
      });

      setUser(mapped);
      localStorage.setItem('casavibes_user', JSON.stringify(mapped));
      return true;
    } catch (err: any) {
      console.error('Login failed:', err);
      /* Propagation vers le composant (LoginPage) */
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error('Password-reset failed:', err);
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('Utilisateur non connecté');
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      return true;
    } catch (err: any) {
      console.error('changePassword failed:', err);
      throw new Error(err?.code || 'auth/unknown');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('casavibes_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      if (data.fullName) {
        await fbUpdateProfile(auth.currentUser!, { displayName: data.fullName });
      }

      await api.put('/users/me', data);

      const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
      setUser(updated);
      localStorage.setItem('casavibes_user', JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Profile update failed:', err);
      return false;
    }
  };

  /* -------------------------------------------------------------- */
  /* Initialisation Firebase                                        */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${idToken}`;

        const stored = localStorage.getItem('casavibes_user');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(await mapFirebaseUser(fbUser));
        }
      } else {
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      }
      setIsLoading(false); // ← uniquement à la toute fin
    });
    return unsub;
  }, []);

  /* -------------------------------------------------------------- */
  /* Context value                                                  */
  /* -------------------------------------------------------------- */
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    changePassword,
    isLoading, // true pendant l’init, jamais pendant login/register
  };

  return (
    <AuthContext.Provider value={value}>
      {/* On ne masque l’app qu’au premier chargement Firebase */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
