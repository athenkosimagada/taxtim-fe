import { useState } from "react";

export default function TransactionsTable({ rows }) {
  const [open, setOpen] = useState({});

  const toggleAll = (value) => {
    const o = {};
    rows.forEach((_, i) => (o[i] = value));
    setOpen(o);
  };

  const typeColor = (type) => {
    if (type === "BUY") return "text-green-700";
    if (type === "SELL") return "text-red-700";
    return "text-blue-700";
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold text-lg">Transaction Breakdown (FIFO)</h2>

        <div className="space-x-2">
          <button onClick={() => toggleAll(true)} className="btn">
            Expand all
          </button>
          <button onClick={() => toggleAll(false)} className="btn">
            Collapse all
          </button>
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="text-left">Type</th>
            <th className="text-left">Asset</th>
            <th className="text-left">Quantity</th>
            <th className="text-left">Fee (ZAR)</th>
            <th className="text-right">Gain (ZAR)</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <>
              <tr
                key={i}
                className="border-t cursor-pointer hover:bg-slate-50"
                onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
              >
                <td className="p-2">{r.date}</td>
                <td className={typeColor(r.type)}>{r.type}</td>
                <td>{r.asset}</td>
                <td>{r.quantity || r.soldQuantity}</td>
                <td>{r.fee || "–"}</td>
                <td className="font-semibold text-right">
                  {r.gain ? `R ${r.gain.toFixed(2)}` : "–"}
                </td>
              </tr>

              {open[i] && r.lots && (
                <tr className="bg-slate-50">
                  <td colSpan="6" className="p-3 space-y-2">
                    <strong>FIFO lots used:</strong>

                    <ul className="list-disc pl-6">
                      {r.lots.map((l, idx) => (
                        <li key={idx}>
                          {l.quantity} {l.asset} @ R{l.unitPriceZar}/coin on{" "}
                          {l.date}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t">
                      <div>
                        <strong>Proceeds:</strong> R {r.proceeds}
                      </div>
                      <div>
                        <strong>Cost:</strong> R {r.cost}
                      </div>
                      <div>
                        <strong>Capital Gain:</strong> R {r.gain} on {r.date}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
