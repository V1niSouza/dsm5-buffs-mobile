import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as loginService } from "../services/authService";
import userService from "../services/userService";

interface AuthContextData {
  userToken: string | null;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const userStr = await AsyncStorage.getItem("user");
      if (token) setUserToken(token);
      if (userStr) setUser(JSON.parse(userStr));
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginService(email, password);
      await AsyncStorage.setItem("userToken", res.access_token);
      await AsyncStorage.setItem("refreshToken", res.refresh_token);
      await AsyncStorage.setItem("expiresAt", res.expires_at.toString());
      setUserToken(res.access_token);


      const { hasProfile, profile: userProfile } = await userService.checkUserProfile();

      if (!hasProfile || !userProfile) {
        throw new Error("Falha ao carregar o perfil do usuário após o login.");
      }
      await AsyncStorage.setItem("user", JSON.stringify(userProfile));

      setUser(userProfile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["userToken", "refreshToken", "expiresAt", "user"]);
    setUserToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ userToken, user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
