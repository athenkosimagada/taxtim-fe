import { useState } from "react";

export default function TransactionsTab({ data }) {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAll = () => {
    const newState = !expandAll;
    setExpandAll(newState);
    const allRows = {};
    data.forEach((_, idx) => {
      allRows[idx] = newState;
    });
    setExpandedRows(allRows);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(value || 0);

  const getTypeBadge = (type) => {
    switch (type) {
      case "BUY":
        return "bg-blue-100 text-blue-700";
      case "SELL":
        return "bg-red-100 text-red-700";
      case "TRADE":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getExplanationText = (type) => {
    if (type === "SELL")
      return "Selling crypto is taxable because you received money.";
    if (type === "TRADE")
      return "Trading crypto for another crypto is treated as selling by SARS.";
    return "Buying crypto is not taxable because you did not sell anything.";
  };

  return (
    <div className="mt-6 space-y-4">
      <button onClick={toggleAll} className="text-sm text-blue-600 underline">
        {expandAll ? "Collapse all calculations" : "Expand all calculations"}
      </button>

      {data.map((tx, idx) => {
        const isExpanded = expandedRows[idx];
        const gain = tx.calculations?.capitalGain ?? 0;
        const isGain = gain > 0;
        const isLoss = gain < 0;

        return (
          <div key={idx} className="card">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleRow(idx)}>
              <div>
                <div className="font-semibold flex items-center gap-2">
                  <span>{isExpanded ? "▼" : "▶"}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadge(tx.type)}`}>
                    {tx.type}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{tx.date}</div>
              </div>
              <div className="text-sm font-medium">{tx.sellCoin} → {tx.buyCoin}</div>
            </div>

            {isExpanded && tx.calculations && (
              <div className={`mt-4 text-sm p-4 rounded ${
                isGain ? "bg-green-50" : isLoss ? "bg-red-50" : "bg-gray-50"
              }`}>
                {/* Explanation */}
                <div className="mb-3 text-gray-700">
                  <strong>Why this transaction is calculated:</strong>
                  <div className="text-xs mt-1">
                    {getExplanationText(tx.type)}
                  </div>
                </div>

                {/* Step 1 */}
                <div className="mb-2">
                  <strong>1️⃣ What you received:</strong>
                  <div className="text-xs">
                    {formatCurrency(tx.calculations.proceeds)}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="mb-2">
                  <strong>2️⃣ What you originally paid:</strong>
                  <div className="text-xs">
                    {formatCurrency(tx.calculations.costBase)}
                  </div>
                </div>

                {/* Subtraction */}
                <div className="mb-3 text-xs bg-white p-2 rounded border">
                  {formatCurrency(tx.calculations.proceeds)} −{" "}
                  {formatCurrency(tx.calculations.costBase)} ={" "}
                  <strong>{formatCurrency(gain)}</strong>
                </div>

                {/* Result */}
                <div
                  className={`font-semibold ${isGain ? "text-green-700" : isLoss ? "text-red-700" : "text-gray-700"}`}
                >
                  {isGain && "You made a profit"}
                  {isLoss && "You made a loss"}
                  {!isGain && !isLoss && "No gain or loss"}:{" "}
                  {formatCurrency(gain)}
                </div>

                {/* FIFO explanation */}
                {tx.calculations.fifoLots?.length > 0 && (
                  <div className="mt-4 text-xs text-gray-600">
                    <div className="font-medium text-gray-700">
                      FIFO lots used (oldest first):
                    </div>
                    <div className="mt-1 space-y-1">
                      {tx.calculations.fifoLots.map((lot, i) => (
                        <div key={i}>
                          {lot.qty} {lot.asset} × {formatCurrency(lot.price)}{" "}
                          bought on {lot.date}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1">
                      SARS requires FIFO: oldest crypto is sold first when
                      calculating profit/loss.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
