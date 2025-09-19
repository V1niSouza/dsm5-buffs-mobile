import { apiFetch } from "../lib/apiClient";

export const getBufalos = async (token?: string) => {
  try {
    const result = await apiFetch("/bufalos");
    // Processamento de dados:
    const bufalosAtivos = result.filter((b: any) => b.status === true).length;

    const machos = result.filter((b: any) => b.sexo === "M" && b.status === true).length;
    const femeas = result.filter((b: any) => b.sexo === "F" && b.status === true).length;

    const bezerros = result.filter((b: any) => b.nivel_maturidade === "B" && b.status === true).length;
    const novilhas = result.filter((b: any) => b.nivel_maturidade === "N" && b.status === true).length;
    const vacas = result.filter((b: any) => b.nivel_maturidade === "V" && b.status === true).length;
    const touros = result.filter((b: any) => b.nivel_maturidade === "T" && b.status === true).length;

    return {
      raw: result,      // Todos os dados crus
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

export default { getBufalos };
