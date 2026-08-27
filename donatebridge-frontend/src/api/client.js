const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const apiFetch = async (path, { method = "GET", body, token } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
};

export const registerUser = (data) =>
  apiFetch("/auth/register", { method: "POST", body: data });

export const loginUser = (credentials) =>
  apiFetch("/auth/login", { method: "POST", body: credentials });

export const fetchMe = (token) => apiFetch("/auth/me", { token });

export const updateProfile = (data, token) =>
  apiFetch("/auth/me", { method: "PATCH", body: data, token });
