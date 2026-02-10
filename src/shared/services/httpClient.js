const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  console.log("Making request to:", `${API_URL}${path}`);
  console.log("Request options:", { ...options, headers });

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

const httpClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export default httpClient;
