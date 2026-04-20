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

  // 🔥 AGREGA ESTO
  userLikes: string[];
  setUserLikes: React.Dispatch<React.SetStateAction<string[]>>;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsVisitor: () => void;
  updateProfile: (data: Partial<User>) => void;
  requireAuth: () => boolean;
  reloadLikes: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [isVisitor, setIsVisitor] = useState(false);
const [userLikes, setUserLikes] = useState<string[]>([]);

useEffect(() => {
  const loadUserData = async (sessionUser: any) => {
    if (!sessionUser) {
      setUser(null);
      setUserLikes([]);
      return;
    }

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', sessionUser.id)
      .single();

    setUser({
      id: sessionUser.id,
      name: perfil?.nombre || 'Usuario',
      email: sessionUser.email || '',
      role: perfil?.rol || 'user',
    });

    // 🔥 traer likes actualizados SIEMPRE
    const { data: likes } = await supabase
      .from("likes")
      .select("publicacion_id")
      .eq("user_id", sessionUser.id);

    setUserLikes(likes?.map(l => l.publicacion_id) || []);
  };

  // 🔥 1. cargar sesión actual
  supabase.auth.getSession().then(({ data }) => {
    loadUserData(data.session?.user);
  });

  // 🔥 2. escuchar cambios (LOGIN / LOGOUT / RESET PASSWORD)
  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      loadUserData(session?.user);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
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

const reloadLikes = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    setUserLikes([]);
    return;
  }

  const { data: likes } = await supabase
    .from("likes")
    .select("publicacion_id")
    .eq("user_id", user.id);

  setUserLikes(likes?.map(l => l.publicacion_id) || []);
};

return (
<AuthContext.Provider
value={{
  user,
  isAuthenticated: !!user,
  isVisitor,

  // 🔥 AGREGA ESTO
  userLikes,
  setUserLikes,

  login,
  register,
  logout,
  continueAsVisitor,
  updateProfile,
  requireAuth,
  reloadLikes,
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
