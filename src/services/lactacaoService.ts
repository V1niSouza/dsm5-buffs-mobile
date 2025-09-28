import { apiFetch } from "../lib/apiClient";
import BufaloService from "./bufaloService"; // ou o caminho correto

export const getCiclosLactacao = async (propriedadeId?: number) => {
  try {
    // Busca todos os ciclos
    const ciclos: any[] = await apiFetch("/ciclos-lactacao");

    // Filtra apenas os que estão Lactando
    const ciclosLactando = ciclos.filter(c => c.status === "Lactando");

    // Se você quiser filtrar por propriedade
    const ciclosFiltrados = propriedadeId
      ? ciclosLactando.filter(c => c.id_bufala && c.id_bufala) // depois tratamos detalhamento do búfalo
      : ciclosLactando;

    // Enriquecendo com os dados do búfalo
    const ciclosEnriquecidos = await Promise.all(
      ciclosFiltrados.map(async c => {
        const bufalo = c.id_bufala
          ? await BufaloService.getBufaloDetalhes(c.id_bufala)
          : null;
        return {
          ...c,
          bufalo: bufalo ? { nome: bufalo.brinco, raca: bufalo.racaNome } : null
        };
      })
    );

    const totalLactando = ciclosEnriquecidos.length;
    const estoque: any[] = await apiFetch("/estoque-leite");

    // Filtra por propriedade se for passado
    const estoquePropriedade = propriedadeId
    ? estoque.filter(e => e.id_propriedade === propriedadeId)
    : estoque;

    // Ordena do mais recente para o mais antigo
    const estoqueOrdenado = estoquePropriedade.sort(
    (a, b) => new Date(b.dt_registro).getTime() - new Date(a.dt_registro).getTime()
    );

    // Pega o registro mais recente
    const estoqueAtual = estoqueOrdenado[0] || null;

    // Quantidade referente a esse registro
    const quantidadeAtual = estoqueAtual?.quantidade
    ? parseFloat(estoqueAtual.quantidade.toFixed(2))
    : 0;
    console.log(quantidadeAtual)


    // Data formatada pt-BR
    const dataFormatada = estoqueAtual?.dt_registro
    ? new Date(estoqueAtual.dt_registro).toLocaleDateString('pt-BR')
    : "N/D";

    // Se não tiver do dia atual, pega o mais recente disponível
    return {
      ciclos: ciclosEnriquecidos,
      totalLactando,
      dataFormatada,
      quantidadeAtual
    };
  } catch (error: any) {
    console.error("Erro ao buscar ciclos de lactação:", error);
    return {
      ciclos: [],
      totalLactando: 0,
      estoqueAtual: null
    };
  }
};

// Estoque
export const registrarEstoque = async (payload: {
  id_propriedade: number;
  quantidade: number;
  dt_registro: string;
  observacao?: string;
}) => {
  return await apiFetch("/estoque-leite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Coletas
export const registrarColeta = async (payload: {
  id_industria: number;
  quantidade: number;
  dt_coleta: string;
  resultado_teste?: boolean;
  observacao?: string;
}) => {
  return await apiFetch("/coletas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Industrias
export const getIndustrias = async () => {
  return await apiFetch("/industrias");
};


export const registrarLactacao = async (payload: {
  id_bufala: number;
  qt_ordenha: number;
  periodo: string;
  ocorrencia: string;
  dt_ordenha: string;
}) => {
  return await apiFetch("/lactacao", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
