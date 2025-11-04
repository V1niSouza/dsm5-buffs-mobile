import AsyncStorage from "@react-native-async-storage/async-storage";

type ApiOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

const API_URL = process.env.API_URL?.replace(/\/$/, "") || "";

// 🔑 Função centralizada para garantir token válido
const getValidToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem("userToken");
  const refresh = await AsyncStorage.getItem("refreshToken");
  const expiresStr = await AsyncStorage.getItem("expiresAt");

  if (!token || !refresh || !expiresStr) return null;

  const expires = Number(expiresStr);
  const now = Math.floor(Date.now() / 1000);

  if (expires > now) return token; // token ainda válido

  // token expirou → renovar
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) {
    await AsyncStorage.multiRemove(["userToken", "refreshToken", "expiresAt"]);
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const data = await res.json();
  await AsyncStorage.setItem("userToken", data.access_token);
  await AsyncStorage.setItem("expiresAt", data.expires_at.toString());
  await AsyncStorage.setItem("refreshToken", data.refresh_token);

  return data.access_token;
};

export const apiFetch = async (endpoint: string, { method = "GET", body = null, headers = {} }: ApiOptions = {}) => {
  const url = `${API_URL}/${endpoint.replace(/^\//, "")}`;

  const token = await getValidToken();

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, fetchOptions);

  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }

  if (!response.ok) {
    const err = new Error((json && typeof json === "object" && json.message) || `Erro ${response.status}`);
    // @ts-ignore
    err.status = response.status;
    throw err;
  }

  return json;
};
