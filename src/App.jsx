import { useState } from "react";
import Header from "./components/Header";
import PasteTransactions from "./components/PasteTransactions";
import Tabs from "./components/Tabs";
import TransactionsTable from "./components/TransactionsTable";
import BaseCostTable from "./components/BaseCostTable";
import CapitalGainsTable from "./components/CapitalGainsTable";
import { api } from "./api";
import { parseExcelPaste } from "./lib/utils";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("transactions");

  async function calculate() {
    const txs = parseExcelPaste(input);
    await api.importTransactions(txs);
    const res = await api.calculate();
    setResult(res);
  }

  async function clearAll() {
    if (!confirm("Delete all transactions and start over?")) return;
    await api.clearAll();
    setInput("");
    setResult(null);
  }

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <PasteTransactions
          value={input}
          onChange={setInput}
          onCalculate={calculate}
          onClear={clearAll}
        />

        {result && (
          <>
            <Tabs active={tab} setActive={setTab} />

            {tab === "transactions" && (
              <TransactionsTable
                transactions={result.transactions}
                calculations={result.calculations}
              />
            )}

            {tab === "baseCosts" && (
              <BaseCostTable data={result.baseCostSnapshots} />
            )}

            {tab === "gains" && (
              <CapitalGainsTable
                data={
                  result.capitalGains[Object.keys(result.capitalGains).pop()]
                }
              />
            )}
          </>
        )}
      </main>
    </>
  );
}
