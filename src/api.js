const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return res.json();
}

export const api = {
  importTransactions: (payload) =>
    fetch(`${API_BASE}/transactions/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),

  calculate: () => fetch(`${API_BASE}/transactions/calculate`).then(handle),

  clearAll: () =>
    fetch(`${API_BASE}/transactions`, {
      method: "DELETE",
    }).then(handle),
};
