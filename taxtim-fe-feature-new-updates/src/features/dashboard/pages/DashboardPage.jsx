import { useState } from "react";
import DataInputCard from "../components/DataInputCard";
import SummaryTab from "../components/SummaryTab";
import TransactionsTab from "../components/TransactionsTab";
import BalancesTab from "../components/BalancesTab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [result, setResult] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Crypto Tax Dashboard</h1>

      <p className="text-gray-600">
        Upload your crypto transactions and see your balances, profit/loss, and
        potential tax. Everything is explained in simple steps, even if you
        don’t know anything about crypto or taxes.
      </p>

      {/* NEW: Tax year explanation box */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm text-gray-700">
        <strong>How South African crypto tax works:</strong>
        <div className="mt-2">
          - The tax year runs from <strong>1 March</strong> to{" "}
          <strong>28/29 February</strong>.
        </div>
        <div className="mt-1">
          - Only transactions where crypto was sold or traded are taxable.
        </div>
        <div className="mt-1">
          - Profits = what you received − what you originally paid.
        </div>
        <div className="mt-1">- Losses reduce your taxable income.</div>
      </div>

      <DataInputCard onResult={setResult} />

      {result && (
        <>
          <div className="flex gap-2 border-b">
            <Tab
              label="Transactions"
              value="transactions"
              active={activeTab}
              onClick={setActiveTab}
            />
            <Tab
              label="Balances"
              value="balances"
              active={activeTab}
              onClick={setActiveTab}
            />
            <Tab
              label="Summary"
              value="summary"
              active={activeTab}
              onClick={setActiveTab}
            />
          </div>

          {activeTab === "summary" && <SummaryTab data={result} />}
          {activeTab === "transactions" && (
            <TransactionsTab data={result.calculations} />
          )}
          {activeTab === "balances" && <BalancesTab data={result.balances} />}
        </>
      )}
    </div>
  );
}

function Tab({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
        active === value
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
