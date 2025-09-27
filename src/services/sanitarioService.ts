import { apiFetch } from "../lib/apiClient";

export const sanitarioService = {
  add: async (payload: any) => {
    try {
      console.log("Payload enviado para API:", payload);

      // Apenas envia, não tenta converter retorno em JSON
      await apiFetch(`/dados-sanitarios`, { 
        method: 'POST', 
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      // Retorno opcional
      return true;

    } catch (err) {
      console.error("Erro ao adicionar histórico sanitário:", err);
      throw err;
    }
  },
  getHistorico: async (id_bufalo: number) => {
    try {
      return await apiFetch(`/dados-sanitarios/bufalo/${id_bufalo}`);
    } catch (err) {
      console.error("Erro ao buscar histórico sanitário:", err);
      throw err;
    }
  },
  getMedicamentos: async () => {
    try {
      return await apiFetch(`/medicamentos`);
    } catch (err) {
      console.error("Erro ao buscar medicamentos:", err);
      throw err;
    }
  },
  delete: async (id_sanit: number) => {
    try {
      return await apiFetch(`/dados-sanitarios/${id_sanit}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Erro ao excluir histórico sanitario:", err);
      throw err;
    }
  },
};



export default sanitarioService;