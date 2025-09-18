import { apiFetch } from "../lib/apiClient";

export const checkUserProfile = async (token?: string) => {
  try {
    const profile = await apiFetch("/usuarios/me", { token });
    return { hasProfile: true, profile };
  } catch (error: any) {
    if (error.status === 404|| error.message.includes("Nenhum perfil")) {
      return { hasProfile: false, profile: null };
    }
    throw error;
  }
};

// Nova função para criar perfil
export const createProfile = async (token: string, data: any) => {
  try {
    const profile = await apiFetch("/usuarios/perfil", {
      method: "POST",
      data,
      token,
    });
    return { success: true, profile };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar perfil" };
  }
};

const userService = {
  checkUserProfile,
  createProfile,
};

export default userService;