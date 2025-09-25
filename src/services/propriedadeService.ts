import { apiFetch } from "../lib/apiClient";

export const getPropriedades = async (token?: string) => {
  try {
    const result = await apiFetch("/propriedades");

    // Se a API retorna no formato { message, propriedades, total }
    const propriedades = result?.propriedades?.map((p: any) => ({
      id: p.id_propriedade,
      nome: p.nome,
    })) || [];

    return { propriedades };
  } catch (error: any) {
    if (error.status === 401 || error.message.includes("Nenhuma Propriedade")) {
      return { propriedades: [] };
    }
    throw error;
  }
};

export default { getPropriedades };
