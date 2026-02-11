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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions/calculate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );

      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError("Failed to calculate transactions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">1. Upload Transactions</h2>
      <p className="text-gray-600 text-sm">
        Upload your Excel (.xls or .xlsx) file.
      </p>

      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Calculating…" : "Calculate"}
      </button>
    </div>
  );
}
