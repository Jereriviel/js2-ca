import { API_BASE } from "../constants";
import { setUser } from "../store/userStore";
import type {
  RegisterResponseData,
  RegisterResponse,
  LoginResponseData,
  LoginResponse,
} from "../types/auth";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponseData> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.errors?.[0]?.message || "Registration failed");
  }

  const json: RegisterResponse = await res.json();
  return json.data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponseData> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.errors?.[0]?.message || "Login failed");
  }

  const json: LoginResponse = await res.json();

  setUser(json.data.accessToken, {
    name: json.data.name,
    email: json.data.email,
  });

  return json.data;
}
