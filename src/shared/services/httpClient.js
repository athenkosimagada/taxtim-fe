const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function httpClient(
  endpoint,
  { method = "GET", body, headers = {} } = {},
) {
  const token = localStorage.getItem("token");

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "API request failed");
  }

  return data;
}
