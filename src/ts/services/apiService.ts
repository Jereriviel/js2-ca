import { API_BASE } from "../constants";
import { ApiError } from "../errors/ApiError";
import { handleError } from "../errors/handleError";

const apiKey = import.meta.env.VITE_API_KEY;

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
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
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw await ApiError.fromResponse(response);
    }

    if (response.status === 204) {
      return null;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function get<T>(endpoint: string): Promise<T | null> {
  return apiFetch<T>(endpoint);
}

export async function post<T>(
  endpoint: string,
  body: object,
): Promise<T | null> {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function put<T>(
  endpoint: string,
  body?: object,
): Promise<T | null> {
  return apiFetch<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del<T>(endpoint: string): Promise<T | null> {
  return apiFetch<T>(endpoint, {
    method: "DELETE",
  });
}
