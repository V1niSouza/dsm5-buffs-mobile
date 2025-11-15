import { apiFetch } from "../lib/apiClient";
import { getBufaloDetalhes } from "./bufaloService";

export type Alerta = {
  nome_animal: string;
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

export type Filtro = "TODOS" | "PENDENTES";

export const getAlertasPorPropriedade = async (
  propriedadeId: string | null,
  filtro: Filtro = "PENDENTES",
  page: number = 1,
  limit: number = 10
) => {
  try {
    const incluirVistos = filtro !== "PENDENTES"; // PENDENTES = só não vistos

    const result = await apiFetch(
      `/alertas/propriedade/${propriedadeId}?incluirVistos=${incluirVistos}&page=${page}&limit=${limit}`
    );

    let alertas: Alerta[] = result.data.map((a: any) => ({
      ...a,
      prioridade: a.prioridade?.toUpperCase(),
    }));

    // Ordena: não vistos primeiro (para quando filtro "TODOS")
    alertas.sort((a, b) => Number(a.visto) - Number(b.visto));

    // Busca o nome real do animal
    const alertasComNome = await Promise.all(
      alertas.map(async (a) => {
        const detalhes = await getBufaloDetalhes(a.animal_id);
        return {
          ...a,
          nome_animal: detalhes?.nome || "Sem nome", // EXTRAÇÃO CORRETA
        };
      })
    );

    return {
      alertas: alertasComNome,
      meta: result.meta,
    };
  } catch (err) {
    console.error("Erro ao buscar alertas:", err);
    return { alertas: [], meta: { page: 1, limit, total: 0, totalPages: 1 } };
  }
};

export const marcarAlertaVisto = async (id_alerta: string) => {
  try {
    const alerta = await apiFetch(`/alertas/${id_alerta}/visto?status=true`, 
    { method: "PATCH" } 
  );
    return alerta
  } catch (err) {
    console.error(`Erro ao marcar alerta ${id_alerta} como visto:`, err);
    throw err;
  }
};
