import { API_BASE } from "../constants";
import { setUser } from "../store/userStore";
import { ApiError } from "../errors/ApiError";
import { handleError } from "../errors/handleError";
import type {
  RegisterResponseData,
  RegisterResponse,
  LoginResponseData,
  LoginResponse,
} from "../types/auth";

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponseData | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      throw await ApiError.fromResponse(res);
    }

    const json: RegisterResponse = await res.json();
    return json.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponseData | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw await ApiError.fromResponse(res);
    }

    const json: LoginResponse = await res.json();

    setUser(json.data.accessToken, {
      name: json.data.name,
      email: json.data.email,
    });

    return json.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}
