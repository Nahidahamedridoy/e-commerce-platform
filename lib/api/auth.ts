import { apiClient, setStoredAuth, clearStoredAuth } from "./client";
import { ApiUser, AuthResponseData } from "./types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const res = await apiClient<AuthResponseData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.data?.token && res.data?.user) {
      setStoredAuth(res.data.token, res.data.user);
    }
    return res.data!;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const res = await apiClient<AuthResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.data?.token && res.data?.user) {
      setStoredAuth(res.data.token, res.data.user);
    }
    return res.data!;
  },

  async getProfile(): Promise<ApiUser> {
    const res = await apiClient<{ user: ApiUser }>("/auth/me", {
      method: "GET",
    });
    return res.data!.user;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiUser> {
    const res = await apiClient<{ user: ApiUser }>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data!.user;
  },

  logout(): void {
    clearStoredAuth();
  },
};
