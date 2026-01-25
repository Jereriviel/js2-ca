export interface RegisterResponseData {
  id: string;
  name: string;
  email: string;
}

export interface RegisterResponse {
  data: RegisterResponseData;
  meta: object;
}

export interface LoginResponseData {
  accessToken: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  data: LoginResponseData;
  meta: object;
}
