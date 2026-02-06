const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function handle(res) {
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export const api = {
  importTransactions(data) {
    return fetch(`${API_BASE}/transactions/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle);
  },

  calculate() {
    return fetch(`${API_BASE}/transactions/calculate`).then(handle);
  },

  taxYear(year) {
    return fetch(`${API_BASE}/reports/tax-year/${year}`).then(handle);
  },

  clearAll() {
    return fetch(`${API_BASE}/transactions`, {
      method: "DELETE",
    }).then(handle);
  },
};
