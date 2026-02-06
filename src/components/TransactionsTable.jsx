import { useState, Fragment } from "react";
import FifoBreakdown from "./FifoBreakdown";
import { money, formatTransactionRow } from "../lib/utils";

export default function TransactionsTable({ transactions, calculations }) {
  const [open, setOpen] = useState({});

  const expandAll = Object.fromEntries(
    transactions
      .map((tx) => {
        if (tx.type === "SELL" || tx.type === "TRADE") {
          const dateStr = formatDate(tx.executedAt);
          const asset = tx.assetFrom || tx.assetTo;
          const key = `${dateStr}-${asset}`;
          return [key, true];
        }
        return null;
      })
      .filter(Boolean),
  );

  const calcByKey = {};
  calculations.forEach((c) => {
    const dateStr = c.date || "";
    const key = `${dateStr}-${c.asset}`;
    calcByKey[key] = c;
  });

  function formatDate(executedAt) {
    let d;
    if (typeof executedAt === "string") {
      d = new Date(executedAt);
    } else if (executedAt?.date) {
      d = new Date(executedAt.date);
    } else {
      return "";
    }
    return d.toISOString().split("T")[0];
  }

  return (
    <div>
      <button
        onClick={() => setOpen(expandAll)}
        className="mb-2 text-sm underline"
      >
        Expand all calculations
      </button>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-start">Wallet</th>
            <th className="text-start">Type</th>
            <th className="text-start">Asset</th>
            <th className="text-start">Qty</th>
            <th className="text-start">Unit Price</th>
            <th className="text-start">Fee</th>
            <th className="text-start">Market Price</th>
            <th className="text-start">Executed At</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx, i) => {
            const dateStr = formatDate(tx.executedAt);
            const asset = tx.assetFrom || tx.assetTo;
            const key = `${dateStr}-${asset}`;
            const calc = calcByKey[key];

            const isDisposal = tx.type === "SELL" || tx.type === "TRADE";
            const view = formatTransactionRow(tx);

            return (
              <Fragment key={key}>
                <tr
                  className={`border-t ${
                    isDisposal
                      ? "cursor-pointer hover:bg-slate-50"
                      : "bg-slate-50"
                  }`}
                  onClick={() => {
                    if (isDisposal) {
                      setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
                    }
                    alert(JSON.stringify(tx));
                  }}
                >
                  <td>{tx.wallet}</td>

                  <td>
                    <span className="font-medium">{tx.type}</span>
                    <div className="text-xs text-slate-500">
                      {view.subtitle}
                    </div>
                  </td>

                  <td className="font-mono">{view.asset}</td>

                  <td>{view.quantity}</td>
                  <td className="text-start">{view.unitPrice}</td>
                  <td className="text-start">{view.fee}</td>
                  <td className="text-start">{view.marketPrice || "-"}</td>
                  <td className="text-start">{dateStr}</td>
                </tr>

                {isDisposal && open[key] && calc && (
                  <tr className="bg-slate-50">
                    <td colSpan="5" className="p-4 space-y-4">
                      <div>
                        <strong>Calculation Details:</strong>
                        <div>Proceeds: {money(calc.proceeds)}</div>
                        <div>Cost: {money(calc.cost)}</div>
                        <div>Gain: {money(calc.gain)}</div>
                        {calc.from && <div>From: {calc.from}</div>}
                        {calc.to && <div>To: {calc.to}</div>}
                        {calc.soldQuantity && (
                          <div>Sold Quantity: {calc.soldQuantity}</div>
                        )}
                      </div>

                      <FifoBreakdown disposal={calc} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
