// services/authService.ts
import { apiFetch } from "../lib/apiClient";

// Login
export const login = async (email: string, password: string) => {
  return apiFetch("/auth/signin", {
    method: "POST",
    body: { email, password },
  });
};

// Cria o perfil do usuário (primeiro login)
export const createProfile = async (
  token: string,
  profileData: { nome: string; cargo: string; telefone: string }
) => {
  return apiFetch("/usuarios/perfil", {
    method: "POST",
    body: profileData, // email NÃO deve ser incluído
  });
};

// Verifica se o usuário já tem perfil criado
export const checkProfile = async (token: string) => {
  return apiFetch("/usuarios/perfil", {
    method: "GET",
  });
};

// Retorna os dados do usuário logado (valida o token)
export const getMe = async (token: string) => {
  return apiFetch("/usuarios/me", {
    method: "GET",
  });
};