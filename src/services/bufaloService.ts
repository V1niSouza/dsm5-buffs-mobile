import { apiFetch } from "../lib/apiClient";

export const getBufalos = async (propriedadeId?: number, token?: string) => {
  try {
    const result = await apiFetch("/bufalos");

    const racas = await apiFetch("/racas"); 

    const mapRacas: Record<number, string> = {};
    racas.forEach((r: any) => {
      mapRacas[r.id_raca] = r.nome;
    });

    const bufalosTratados = result.map((b: any) => ({
      ...b,
      racaNome: mapRacas[b.id_raca] || "Desconhecida",
    }));


    // Processamento de dados:
    const bufalosFiltrados = result.filter((b: any) => b.id_propriedade === propriedadeId);

    const bufalosAtivos = bufalosFiltrados.filter((b: any) => b.status === true).length;

    const machos = bufalosFiltrados.filter((b: any) => b.sexo === "M" && b.status === true).length;
    const femeas = bufalosFiltrados.filter((b: any) => b.sexo === "F" && b.status === true).length;

    const bezerros = bufalosFiltrados.filter((b: any) => b.nivel_maturidade === "B" && b.status === true).length;
    const novilhas = bufalosFiltrados.filter((b: any) => b.nivel_maturidade === "N" && b.status === true).length;
    const vacas = bufalosFiltrados.filter((b: any) => b.nivel_maturidade === "V" && b.status === true).length;
    const touros = bufalosFiltrados.filter((b: any) => b.nivel_maturidade === "T" && b.status === true).length;

    return {
      raw: bufalosTratados,      
      countsSex: { machos, femeas },
      countsMat:  { bezerros, novilhas, vacas, touros },
      count: { bufalosAtivos }
    };
  } catch (error: any) {
    if (error.status != 404 || error.message.includes("Nenhum Bufalo")) {
      return { raw: [], countsSex: { machos: 0, femeas: 0 }, countsMat: { bezerros: 0, novilhas: 0, vacas: 0, touros: 0 }, count: {bufalosAtivos: 0} };
    }
    throw error;
  }
};

const getBufaloDetalhes = async (id: number) => {
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

export default { getBufalos, getBufaloDetalhes };
