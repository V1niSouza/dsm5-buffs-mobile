import { apiFetch } from "../lib/apiClient";

export const sanitarioService = {
  getHistorico: async (id_bufalo: number) => {
    try {
      return await apiFetch(`/dados-sanitarios/bufalo/${id_bufalo}`);
    } catch (err) {
      console.error("Erro ao buscar histórico sanitário:", err);
      throw err;
    }
  },
  add: async (id_bufalo: number, payload: any) => {
    try {
      return await apiFetch(`/dados-sanitarios/bufalo/${id_bufalo}`, { method: 'POST', body: payload });
    } catch (err) {
      console.error("Erro ao adicionar histórico sanitário:", err);
      throw err;
    }
  }
};


export default sanitarioService;