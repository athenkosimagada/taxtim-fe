import { useState } from "react";

import Header from "./components/Header";
import PasteInput from "./components/PasteInput";
import TransactionsTable from "./components/TransactionsTable";
import CapitalGainsSummary from "./components/CapitalGainsSummary";
import BaseCosts from "./components/BaseCosts";
import { Button } from "./components/Button";

import { buildDisplayRows, parseExcelPaste } from "./lib/utils";
import { api } from "./api";

export default function App() {
  const [paste, setPaste] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const calculate = async () => {
    try {
      setStatus("Calculating…");

      const parsed = parseExcelPaste(paste);
      await api.importTransactions(parsed);

      const fifo = await api.calculate();
      setResult(fifo);

      setStatus("");
    } catch (e) {
      console.error(e);
      setStatus("Error processing transactions");
    }
  };

  const resetAll = async () => {
    if (!confirm("This will remove ALL transactions. Continue?")) return;

    await api.clearAll();
    setPaste("");
    setResult(null);
    setStatus("All data cleared.");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <PasteInput value={paste} onChange={setPaste} />

        <div className="flex gap-3">
          <Button onClick={calculate}>Calculate</Button>
          <Button onClick={resetAll} variant="danger">
            Clear & Restart
          </Button>
        </div>

        {status && (
          <div className="bg-yellow-100 border p-3 rounded">{status}</div>
        )}

        {result && (
          <>
            <TransactionsTable rows={buildDisplayRows(result)} />

            <CapitalGainsSummary capitalGains={result.capitalGains} />

            <BaseCosts snapshots={result.baseCostSnapshots} />
          </>
        )}
      </main>
    </div>
  );
}
