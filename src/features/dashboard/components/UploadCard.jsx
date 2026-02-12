import { useState } from "react";
import {
  postTransactions,
  calculateTransactions,
} from "../../dashboard/services/transactions.api";

export default function UploadCard({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCalculate() {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

      const res = await fetch(`${API_BASE}/transactions/calculate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError("Failed to calculate transactions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">1. Upload Transactions</h2>
      <p className="text-gray-600 text-sm">Upload your Excel (.xls or .xlsx) file.</p>

      <div className="file-input-wrapper">
        <input
          aria-label="Upload transactions file"
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button onClick={handleCalculate} disabled={loading} className="btn btn-primary">
        {loading ? "Calculating…" : "Calculate"}
      </button>
    </div>
  );
}
