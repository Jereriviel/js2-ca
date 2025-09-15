import { API_BASE } from "../constants";

const apiKey = "d671ac05-4c3a-46df-860f-f1c8e63b8be5";

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = API_BASE + endpoint;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": apiKey,
    ...(options.headers as Record<string, string>),
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: T = await response.json();

    if (!response.ok) {
      const message =
        (data as any)?.errors?.[0]?.message || `An unknown error occurred`;
      throw new Error(message);
    }

    return data as T;
  } catch (error) {
    throw error;
  }
}

export async function get<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint);
}

export async function post<T>(endpoint: string, body: object): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function put<T>(endpoint: string, body: object): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
