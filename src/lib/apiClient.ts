import { supabase } from "./supabase";

type ApiOptions = {
  method?: string;
  data?: any;
  token?: string | null;
};

export const apiFetch = async (
  endpoint: string,
  { method = "GET", data = null, token = null }: ApiOptions = {}
) => {
  try {
    if (!token) {
      const session = (await supabase.auth.getSession()).data.session;
      token = session?.access_token || null;
      if (!token) throw new Error("Usuário não autenticado.");
    }

    const url = `${process.env.API_URL?.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(json.message || `Erro ${response.status}`);
      // @ts-ignore
      err.status = response.status;
      throw err;
    }

    return json;
  } catch (error: any) {
    if (!error.status || error.status !== 404){
        console.error("❌ Erro em apiFetch:", error.message);
    }
    throw error;
  }
};

const apiClient = { apiFetch };
export default apiClient;
