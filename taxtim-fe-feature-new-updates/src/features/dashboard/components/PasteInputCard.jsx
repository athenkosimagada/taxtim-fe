import { useState } from "react";
import { parseTransactionsFromText } from "../../dashboard/utils/parseTransactions";
import {
  postTransactions,
  calculateTransactions,
} from "../../dashboard/services/transactions.api";

export default function PasteInputCard({ onResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleProcess() {
    try {
      if (!text.trim()) {
        throw new Error("Please paste your transactions first");
      }

      setLoading(true);
      setError(null);

      const transactions = parseTransactionsFromText(text);

      if (!transactions.length) {
        throw new Error("No valid transactions found");
      }

      await postTransactions(transactions);
      const result = await calculateTransactions();

      onResult(result);
    } catch (err) {
      setError(err.message || "Failed to process transactions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Paste Transactions</h2>
      <p className="text-sm text-gray-600">Paste directly from Excel (Ctrl+C → Ctrl+V). No formatting required.</p>

      <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your Excel rows here" />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button onClick={handleProcess} disabled={loading} className="btn btn-primary">
        {loading ? "Processing…" : "Upload & Calculate"}
      </button>
    </div>
  );
}
