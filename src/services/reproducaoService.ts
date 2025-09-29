import { apiFetch } from "../lib/apiClient";

const fetchBrincoTouro = async (r: any) => {
  if (r.id_bufalo) {
    const bufalo = await apiFetch(`/bufalos/${r.id_bufalo}`);
    return bufalo.brinco;
  } else if (r.id_semen) {
    const semen = await apiFetch(`/material-genetico/${r.id_semen}`);
    return semen.fornecedor;
  }
  return "-";
};

// Função para buscar o brinco da vaca
const fetchBrincoVaca = async (r: any) => {
  if (r.id_bufala) {
    const vaca = await apiFetch(`/bufalos/${r.id_bufala}`); // ou `/vacas/${r.id_vaca}` se existir rota separada
    return vaca.brinco || "-";
  }
  return "-";
};

export const getReproducoes = async (propriedadeId?: number) => {
    
  try {
    // Busca todas as reproduções
    const reproducoes: any[] = await apiFetch("/cobertura");

    // Filtra por propriedade (se necessário)
    const reproducoesFiltradas = propriedadeId
      ? reproducoes.filter(r => r.id_propriedade === propriedadeId)
      : reproducoes;

    // Mantém apenas os status desejados
    const reproducoesValidas = reproducoesFiltradas.filter(r =>
      ["Falha", "Confirmada", "Em Processo"].includes(r.status)
    );

    // Ordena por data (mais recente primeiro)
    const reproducoesOrdenadas = reproducoesValidas.sort(
      (a, b) => new Date(b.dt_registro).getTime() - new Date(a.dt_registro).getTime()
    );

    // Formata cada reprodução
    const reproducoesFormatadas = await Promise.all(
      reproducoesOrdenadas.map(async r => ({
        id: r.id,
        status: r.status,
        dt_evento: new Date(r.dt_evento).toLocaleDateString("pt-BR"),
        brincoVaca: await fetchBrincoVaca(r),
        brincoTouro: await fetchBrincoTouro(r),
        tipoInseminacao: r.tipo_inseminacao === "Inseminação Artificial"
        ? "IA"
        : r.tipo_inseminacao === "Monta Natural"
        ? "Natural"
        : "-"
      }))
    );
    return reproducoesFormatadas;
  } catch (error: any) {
    console.error("Erro ao buscar reproduções:", error);
    return [];
  }
};

export const updateReproducao = async (id: number, data: any) => {
  try {
    const response = await apiFetch(`/cobertura/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar reprodução:", error);
    throw error;
  }
};

export const createReproducao = async (data: any) => {
  try {
    const response = await apiFetch("/cobertura", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Erro ao criar reprodução:", error);
    throw error;
  }
};
