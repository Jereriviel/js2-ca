import { API_BASE } from "../constants";
import { setUser } from "../store/userStore";

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  accessToken: string;
  name: string;
  email: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.errors?.[0]?.message || "Registration failed");
  }

  return await res.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.errors?.[0]?.message || "Login failed");
  }

  const data: LoginResponse = await res.json();

  setUser(data.accessToken, { name: data.name, email: data.email });

  return data;
}
