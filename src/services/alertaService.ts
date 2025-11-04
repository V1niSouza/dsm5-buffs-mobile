import { apiFetch } from "../lib/apiClient";

export type Alerta = {
  id_alerta: string;
  animal_id: string;
  grupo: string;
  localizacao: string;
  motivo: string;
  nicho: string;
  data_alerta: string;
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
  observacao: string;
  visto: boolean;
  id_evento_origem: string | null;
  tipo_evento_origem: string | null;
  id_propriedade: string;
  created_at: string;
  updated_at: string;
};

export const getAlertasPorPropriedade = async (
  propriedadeId: string  | null,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const result = await apiFetch(
      `/alertas/propriedade/${propriedadeId}?incluirVistos=true&page=${page}&limit=${limit}`
    );

    const alertas: Alerta[] = result.data.map((a: any) => ({
      ...a,
      prioridade: a.prioridade.toUpperCase(),
    }));

    return {
      alertas,
      meta: result.meta || {
        page: 1,
        limit,
        total: alertas.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } catch (err) {
    console.error("Erro ao buscar alertas:", err);
    return {
      alertas: [],
      meta: {
        page: 1,
        limit,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
};

export const marcarAlertaVisto = async (id_alerta: string) => {
  try {
    const alerta = await apiFetch(`/alertas/${id_alerta}/visto`, {
      method: "PATCH",
    });
    return alerta;
  } catch (err) {
    console.error(`Erro ao marcar alerta ${id_alerta} como visto:`, err);
    throw err;
  }
};

export default { getAlertasPorPropriedade, marcarAlertaVisto };
