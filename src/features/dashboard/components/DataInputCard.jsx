import { useState } from "react";
import { parseTransactionsFromText } from "../utils/parseTransactions";
import { parseTransactionsFromExcel } from "../utils/parseTransactionsFromExcel";
import {
  postTransactions,
  calculateTransactions,
  deleteAllTransactions,
} from "../services/transactions.api";

export default function DataInputCard({ onResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function processTransactions(transactions) {
    if (!transactions.length) {
      throw new Error(
        "No valid transactions found. Please check your Excel rows or pasted text.",
      );
    }

    await postTransactions(transactions);
    const result = await calculateTransactions();
    onResult(result);
  }

  async function handlePaste() {
    try {
      setLoading(true);
      setError(null);

      const transactions = parseTransactionsFromText(text);
      await processTransactions(transactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExcelUpload(file) {
    try {
      setLoading(true);
      setError(null);

      const transactions = await parseTransactionsFromExcel(file);
      await processTransactions(transactions);
    } catch (err) {
      setError(
        err.message ||
          "Failed to read Excel file. Please make sure it has the correct format.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    await deleteAllTransactions();
    setText("");
    onResult(null);
    setError(null);
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold">Add Your Transactions</h2>

      <p className="text-gray-600 text-sm">
        Upload your Excel file or paste your transactions below. Format example:
      </p>

      <pre className="bg-gray-50 p-2 rounded text-xs font-mono overflow-x-auto">
        Date Type SellCoin SellAmount BuyCoin BuyAmount BuyPricePerCoin
        <br />
        2023-05-03 10:34:09 BUY ZAR 10000 BTC 0.1000000 R 100,000.00
      </pre>

      {/* Upload */}
      <div>
        <label className="block font-medium mb-1">Upload Excel file</label>
        <input
          className="cursor-pointer w-fit border rounded-lg p-3 text-sm font-mono"
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => handleExcelUpload(e.target.files[0])}
        />
      </div>

      <div className="text-center text-gray-400">OR</div>

      {/* Paste */}
      <div>
        <label className="block font-medium mb-1">Paste from Excel</label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm font-mono"
          placeholder="Paste your Excel rows here"
        />
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePaste}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Processing…" : "Calculate"}
        </button>

        <button
          onClick={handleClear}
          className="border px-6 py-2 rounded-lg text-gray-700"
        >
          Clear & Start Again
        </button>
      </div>

      <p className="text-gray-500 text-xs mt-2">
        Tip: Only SELL or TRADE transactions create tax events. BUY is just
        holding crypto.
      </p>
    </div>
  );
}
