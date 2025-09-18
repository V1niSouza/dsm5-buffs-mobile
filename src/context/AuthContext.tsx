import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import userService from "../services/userService";

interface AuthContextProps {
  user: User | null;
  setAuth: (authUser: User | null) => void;
  loading: boolean;
  profile: any;
  needsProfile: boolean;
  setNeedsProfile?: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  createProfile: (data: any) => Promise<any>;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [needsProfile, setNeedsProfile] = useState(false);

  // Atualiza o usuário
  function setAuth(authUser: User | null) {
    setUser(authUser);
  }

  // Função para checar perfil
  const checkUserProfile = async (token?: string) => {
    try {
      const result = await userService.checkUserProfile(token);
      setProfile(result.profile);
      setNeedsProfile(!result.hasProfile);
      return result.hasProfile;
    } catch (err) {
      console.error("Erro checando perfil:", err);
      setProfile(null);
      setNeedsProfile(true);
      return false;
    }
  };

  // Criar perfil
  const createProfile = async (profileData: any) => {
    try {
      const token = await supabase.auth.getSession().then(
        ({ data: { session } }) => session?.access_token
      );
      if (!token) throw new Error("Token não encontrado");

      const result = await userService.createProfile(token, profileData);
      if (result.success) {
        setProfile(result.profile);
        setNeedsProfile(false);
      }
      return result;
    } catch (err: any) {
      console.error("Erro criando perfil:", err);
      return { success: false, error: err.message };
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      if (data.session) {
        setUser(data.user);
        await checkUserProfile(data.session.access_token);
        return { success: true };
      }
      return { success: false, error: "Falha no login" };
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { success: false, error: error.message };

      setUser(data.user);
      setNeedsProfile(true);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setNeedsProfile(false);
    } finally {
      setLoading(false);
    }
  };

  // Inicialização
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await checkUserProfile(session.access_token);
      } else {
        setUser(null);
        setProfile(null);
        setNeedsProfile(false);
      }
      setLoading(false);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await checkUserProfile(session.access_token);
      } else {
        setUser(null);
        setProfile(null);
        setNeedsProfile(false);
      }
      setLoading(false);
    });

    return () => data?.subscription?.unsubscribe?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAuth, loading, profile, needsProfile, setNeedsProfile,login, signUp, logout, createProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
