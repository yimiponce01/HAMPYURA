import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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
logout: () => Promise<void>;
continueAsVisitor: () => void;
updateProfile: (data: Partial<User>) => void;
requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [isVisitor, setIsVisitor] = useState(false);

useEffect(() => {
const getSession = async () => {
const { data } = await supabase.auth.getSession();


  if (data.session?.user) {
    const user = data.session.user;

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setUser({
      id: user.id,
      name: perfil?.nombre || 'Usuario',
      email: user.email || '',
      role: perfil?.rol || 'user',
    });
  }
};

getSession();


}, []);

const login = async (email: string, password: string) => {
const { data, error } = await supabase.auth.signInWithPassword({
email,
password,
});


if (error) {
  throw new Error(error.message);
}

if (data.user) {
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  const userData: User = {
    id: data.user.id,
    name: perfil?.nombre || 'Usuario',
    email: data.user.email || '',
    role: perfil?.rol || 'user',
  };

  setUser(userData);
  setIsVisitor(false);
}


};

const register = async (name: string, email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    return;
  }

  // 🔥 LOGIN AUTOMÁTICO
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError || !loginData.user) {
    console.error(loginError?.message);
    return;
  }

  const userId = loginData.user.id;

  // 🔥 CREAR PERFIL
  await supabase.from('perfiles').insert({
    id: userId,
    nombre: name,
    email: email,
    rol: 'user',
  });

  // 🔥 NOTIFICACIÓN (AQUÍ VA)
  const { error: notifError } = await supabase
    .from("notificaciones")
    .insert({
      actor_id: userId,
      tipo: "registro"
    });

  console.log("NOTIF ERROR:", notifError);

  // 🔥 RECIÉN AQUÍ REDIRIGES
  window.location.href = "/";
};

const logout = async () => {
  await supabase.auth.signOut();
  setUser(null);
  setIsVisitor(false);
};

const continueAsVisitor = () => {
  setIsVisitor(true);
};

const updateProfile = (data: Partial<User>) => {
  if (user) {
  setUser({ ...user, ...data });
  }
};

const requireAuth = () => {
return !!(user && user.role !== 'visitor');
};

return (
<AuthContext.Provider
  value={{
  user,
  isAuthenticated: !!user,
  isVisitor,
  login,
  register,
  logout,
  continueAsVisitor,
  updateProfile,
  requireAuth,
  }}
  >
  {children}
  </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
  throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
