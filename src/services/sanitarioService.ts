import { apiFetch } from "../lib/apiClient";

const fetchMedicamentosMap = async () => {
  try {
    const medicamentos = await apiFetch("/medicamentos");
    const mapMedicamentos: Record<string, string> = {};
    medicamentos.forEach((m: any) => (mapMedicamentos[m.id_medicacao] = m.medicacao));

    return mapMedicamentos;
  } catch (err) {
    console.error("Erro ao buscar mapa de medicamentos:", err);
    return {};
  }
};

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
getHistorico: async (id_bufalo: string, page: number = 1, limit: number = 10) => {
    try {
      const mapMedicamentos = await fetchMedicamentosMap();
      const result = await apiFetch(`/dados-sanitarios/bufalo/${id_bufalo}?page=${page}&limit=${limit}`);
      const dadosTratados = result.data.map((registro: any) => {

        const idMedicao = registro.id_medicao;
        const nomeMedicamento = mapMedicamentos[idMedicao] || 'Medicamento Desconhecido';

        return {
          ...registro,
          nome_medicamento: nomeMedicamento, 
        };
      });
      
      return {
        ...result,
        data: dadosTratados,
      };
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