const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3131/api/v1";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Permintaan gagal diproses.");
  }

  return body.data ?? body;
}
