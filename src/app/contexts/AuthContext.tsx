import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'visitor' | 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVisitor: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  continueAsVisitor: () => void;
  updateProfile: (data: Partial<User>) => void;
  requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVisitor, setIsVisitor] = useState(false);

  useEffect(() => {
    // Cargar sesión del localStorage
    const savedUser = localStorage.getItem('hampiyura_user');
    const savedVisitor = localStorage.getItem('hampiyura_visitor');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (savedVisitor === 'true') {
      setIsVisitor(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulación de login - en producción sería una llamada a API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Usuario de ejemplo
    const mockUser: User = {
      id: '1',
      name: 'Usuario Demo',
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    };
    
    setUser(mockUser);
    setIsVisitor(false);
    localStorage.setItem('hampiyura_user', JSON.stringify(mockUser));
    localStorage.removeItem('hampiyura_visitor');
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
    };
    
    setUser(newUser);
    setIsVisitor(false);
    localStorage.setItem('hampiyura_user', JSON.stringify(newUser));
    localStorage.removeItem('hampiyura_visitor');
  };

  const logout = () => {
    setUser(null);
    setIsVisitor(false);
    localStorage.removeItem('hampiyura_user');
    localStorage.removeItem('hampiyura_visitor');
  };

  const continueAsVisitor = () => {
    setIsVisitor(true);
    localStorage.setItem('hampiyura_visitor', 'true');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('hampiyura_user', JSON.stringify(updatedUser));
    }
  };

  const requireAuth = () => {
    return !!(user && user.role !== 'visitor');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isVisitor,
      login,
      register,
      logout,
      continueAsVisitor,
      updateProfile,
      requireAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
