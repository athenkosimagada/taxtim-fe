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

  /**
   * Send transactions to backend and calculate
   */
  async function processTransactions(transactions) {
    if (!transactions || !transactions.length) {
      throw new Error(
        "No valid transactions found. Please check your Excel rows or pasted text.",
      );
    }

    await postTransactions(transactions);
    const result = await calculateTransactions();
    onResult(result);
  }

  /**
   * Handle pasted Excel text
   */
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

  /**
   * Handle Excel file upload
   */
  async function handleExcelUpload(e) {
    try {
      setLoading(true);
      setError(null);

      const file = e.target.files?.[0];
      if (!file) {
        throw new Error("Please select a file.");
      }

      const transactions = await parseTransactionsFromExcel(file);
      console.log("Parsed transactions from Excel:", transactions);
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

  /**
   * Clear all stored transactions
   */
  async function handleClear() {
    try {
      await deleteAllTransactions();
      setText("");
      setError(null);
      onResult(null);
    } catch {
      setError("Failed to clear transactions.");
    }
  }

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-semibold">Add Your Transactions</h2>

      <p className="text-gray-600 text-sm">Upload your Excel file or paste your transactions below.</p>

      {/* Example Format */}
      <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
        <div>
          Date | Type | SellCoin | SellAmount | BuyCoin | BuyAmount | BuyPricePerCoin
        </div>
        <div>
          2023-05-03 10:34:09 | BUY | ZAR | 10000 | BTC | 0.1000000 | R 100,000.00
        </div>
      </div>

      {/* Excel Upload */}
      <div>
        <label className="form-label">Upload Excel file</label>
        <input type="file" accept=".xls,.xlsx,.csv" onChange={handleExcelUpload} />
      </div>

      <div className="text-center text-gray-400">OR</div>

      {/* Paste Text */}
      <div>
        <label className="form-label">Paste from Excel</label>
        <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your Excel rows here" />
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={handlePaste} disabled={loading} className="btn btn-primary">
          {loading ? "Processing…" : "Calculate"}
        </button>

        <button onClick={handleClear} className="btn btn-secondary">
          Clear & Start Again
        </button>
      </div>

      {/* Helpful Explanation */}
      <div className="text-gray-500 text-xs mt-3 space-y-1">
        <div>• BUY = You are purchasing crypto (not taxable yet).</div>
        <div>• SELL = You sold crypto for cash (taxable event).</div>
        <div>• TRADE = You swapped crypto for another crypto (also taxable).</div>
      </div>
    </div>
  );
}
