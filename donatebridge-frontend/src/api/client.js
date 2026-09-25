const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const apiFetch = async (path, { method = "GET", body } = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "The backend server is not running. Start it with: cd D:\\DonateBridge\\donatebridge-backend && npm run dev",
      );
    }

    throw error;
  }
};

export const registerUser = (data) =>
  apiFetch("/auth/register", { method: "POST", body: data });

export const loginUser = (credentials) =>
  apiFetch("/auth/login", { method: "POST", body: credentials });

export const logoutUser = () => apiFetch("/auth/logout", { method: "POST" });

export const fetchMe = () => apiFetch("/auth/me");

export const fetchDonationPosts = () => apiFetch("/donation-posts");

export const seedDonationPosts = () => apiFetch("/donation-posts/seed");

export const createDonationPost = (data) =>
  apiFetch("/donation-posts", { method: "POST", body: data });

export const fetchMyDonationPosts = () => apiFetch("/donation-posts/mine");

export const fetchDonationPost = (id) => apiFetch(`/donation-posts/${id}`);

export const fetchDonationPostById = (id) => apiFetch(`/donation-posts/${id}`);

export const updateDonationPost = (id, data) =>
  apiFetch(`/donation-posts/${id}`, { method: "PATCH", body: data });

export const deleteDonationPost = (id) =>
  apiFetch(`/donation-posts/${id}`, { method: "DELETE" });

export const createPickupRequest = (data) =>
  apiFetch("/pickup-requests", { method: "POST", body: data });

export const fetchMyPickupRequests = () => apiFetch("/pickup-requests/mine");

export const cancelPickupRequest = (id) =>
  apiFetch(`/pickup-requests/${id}`, { method: "DELETE" });

export const fetchAllPickupRequests = () => apiFetch("/pickup-requests/all");

export const updateProfile = (data) =>
  apiFetch("/auth/me", { method: "PATCH", body: data });

export const fetchAdminStats = () => apiFetch("/admin/stats");


export const approvePickupRequest = (id, data) =>
  apiFetch(`/admin/pickup-requests/${id}/approve`, { method: "PATCH", body: data });

export const rejectPickupRequest = (id, data) =>
  apiFetch(`/admin/pickup-requests/${id}/reject`, { method: "PATCH", body: data });

export const schedulePickup = (id, data) =>
  apiFetch(`/admin/pickup-requests/${id}/schedule`, { method: "PATCH", body: data });

export const confirmCollection = (id) =>
  apiFetch(`/admin/pickup-requests/${id}/collect`, { method: "PATCH" });

export const fetchDonationHistory = () => apiFetch("/admin/history");

export const fetchAllUsers = () => apiFetch("/admin/users");
