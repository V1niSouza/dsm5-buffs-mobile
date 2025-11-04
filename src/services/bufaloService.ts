import { apiFetch } from "../lib/apiClient";

export const getBufalos = async (propriedadeId: number, page = 1, limit = 10) => {
  try {
    // Chamada paginada da nova API
    const result = await apiFetch(`/bufalos/propriedade/${propriedadeId}?page=${page}&limit=${limit}`);

    const bufalos = result.data.map((b: any) => ({
      ...b,
      racaNome: b.raca?.nome || "Desconhecida",
    }));

    return {
      bufalos,
      meta: result.meta, // info de paginação
    };
  } catch (error: any) {
    console.error("Erro ao buscar búfalos:", error);
    return {
      bufalos: [],
      meta: { page: 1, limit, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
  }
};

const getBufaloDetalhes = async (id: string) => {
  try {
    const bufalo = await apiFetch(`/bufalos/${id}`);
    const racas = await apiFetch("/racas");
    const mapRacas: Record<number, string> = {};
    racas.forEach((r: any) => (mapRacas[r.id_raca] = r.nome));

    // Função auxiliar para pegar nome do pai/mãe
    const getParentescoNome = async (id_parent: number, tipo: 'pai' | 'mae') => {
      if (!id_parent) return "Desconhecido";
      const registro = await apiFetch(`/bufalos/${id_parent}`).catch(async () => {
        // Se não for bufalo, tenta no material-genetico
        const matGen = await apiFetch(`/material-genetico/${id_parent}`);
        return { brinco: matGen.nome || "Desconhecido" };
      });
      return registro.brinco || "Desconhecido";
    };

    const paiNome = await getParentescoNome(bufalo.id_pai, 'pai');
    const maeNome = await getParentescoNome(bufalo.id_mae, 'mae');

    return {
      ...bufalo,
      racaNome: mapRacas[bufalo.id_raca] || "Desconhecida",
      paiNome,
      maeNome,
    };
  } catch (err) {
    console.error("Erro ao buscar detalhes do búfalo:", err);
    throw err;
  }
};

export const createBufalo = async (data: any) => {
  try {
    const bufalo = await apiFetch("/bufalos", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return bufalo;
  } catch (err) {
    console.error("Erro ao criar búfalo:", err);
    throw err;
  }
};

export const updateBufalo = async (id: number, data: any) => {
  try {
    const bufalo = await apiFetch(`/bufalos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return bufalo;
  } catch (err) {
    console.error(`Erro ao atualizar búfalo ${id}:`, err);
    throw err;
  }
};

export const deleteBufalo = async (id: number) => {
  try {
    await apiFetch(`/bufalos/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (err) {
    console.error(`Erro ao deletar búfalo ${id}:`, err);
    throw err;
  }
};


export const getRacas = async () => {
  try {
    const racas = await apiFetch("/racas");
    return racas; // já é a lista de raças
    console.log(racas);
  } catch (err) {
    console.error("Erro ao buscar raças:", err);
    throw err;
  }
};



export default { getBufalos, getBufaloDetalhes, createBufalo, updateBufalo, deleteBufalo, getRacas };
