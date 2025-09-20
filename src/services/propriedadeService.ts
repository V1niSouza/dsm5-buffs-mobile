import { apiFetch } from "../lib/apiClient";

export const getPropriedades = async (token?: string) => {
  try {
    const result = await apiFetch("/propriedades");
    return {
      propriedades: result,      // Todos os dados crus
    };
  } catch (error: any) {
    if (error.status === 401 || error.message.includes("Nenhuma Propriedade")) {
      return { propriedades: [] };
    }
    throw error;
  }
};

export default { getPropriedades };
