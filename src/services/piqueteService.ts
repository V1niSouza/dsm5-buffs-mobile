import { apiFetch } from "../lib/apiClient";

export interface Piquete {
  id: number;
  nome: string;
  coords: { latitude: number; longitude: number }[];
}

export const piqueteService = {
  async getAll(id: number): Promise<Piquete[]> {
    const response = await apiFetch(`/lotes/propriedade/${id}`);

    // Normaliza o formato vindo do backend para o esperado pelo app
    return response.map((item: any) => {
      // GeoJSON Polygon: coordinates[0] é um array de pares [lng, lat]
      const coords =
        item.geo_mapa?.coordinates?.[0]?.map((c: number[]) => ({
          latitude: c[1],
          longitude: c[0],
        })) ?? [];

      return {
        id: item.id_lote,
        nome: item.nome_lote,
        coords,
      } as Piquete;
    });
  },
};

