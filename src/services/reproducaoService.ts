import { apiFetch } from "../lib/apiClient";

const fetchNomeAnimal = async (id: string) => {
  if (!id) return "-";
  try {
    const animal = await apiFetch(`/bufalos/${id}`);
    return animal.nome || id;
  } catch (error) {
    console.error(`Erro ao buscar animal ${id}:`, error);
    return id;
  }
};

const fetchNomeSemenOuOvulo = async (id: string) => {
  if (!id) return "-";
  return `${id.slice(0, 5)}`;
};

export const getReproducoes = async (propriedadeId: number) => {
  if (!propriedadeId) return [];

  try {
    let page = 1;
    const limit = 10; 
    let allReproducoes: any[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
      const response: any = await apiFetch(
        `/cobertura/propriedade/${propriedadeId}?page=${page}&limit=${limit}`
      );

      const reproducoes: any[] = response.data || [];
      allReproducoes = allReproducoes.concat(reproducoes);

      hasNextPage = response.meta?.hasNextPage;
      page++;
    }

    const reproducoesFormatadas = await Promise.all(
      allReproducoes.map(async (r) => ({
        id: r.id_reproducao,
        status: r.status,
        dt_evento: new Date(r.dt_evento).toLocaleDateString("pt-BR"),
        tipoInseminacao:
          r.tipo_inseminacao === "Inseminação Artificial"
            ? "IA"
            : r.tipo_inseminacao === "Monta Natural"
            ? "Natural"
            : "-",
        tipoParto: r.tipo_parto || "-",
        brincoVaca: r.id_bufala ? await fetchNomeAnimal(r.id_bufala) : "-",
        brincoTouro: r.id_bufalo
          ? await fetchNomeAnimal(r.id_bufalo)
          : r.id_semen
          ? await fetchNomeSemenOuOvulo(r.id_semen)
          : r.id_ovulo
          ? await fetchNomeSemenOuOvulo(r.id_ovulo)
          : "-",
        primeiraCria: r.primeira_cria || false,
      }))
    );

    return reproducoesFormatadas;
  } catch (error: any) {
    console.error("Erro ao buscar reproduções:", error);
    return [];
  }
};

export const updateReproducao = async (id: string, data: any) => {
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
