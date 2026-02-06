import { money } from "../lib/utils";

export default function FifoBreakdown({ disposal }) {
  return (
    <div>
      <h4 className="font-semibold mb-2">FIFO Breakdown</h4>

      <ul className="list-disc pl-6 text-sm">
        {disposal.lots.map((l, i) => (
          <li key={i}>
            {l.quantity} {l.asset} @ {money(l.unitPriceZar)} ({l.date}){" → "}
            {money(l.cost)}
          </li>
        ))}
      </ul>

      <div className="mt-3 border-t pt-2 text-sm">
        <p>
          <strong>Total Cost:</strong> {money(disposal.cost)}
        </p>
        <p>
          <strong>Proceeds:</strong> {money(disposal.proceeds)}
        </p>
        <p className="font-semibold">Capital Gain: {money(disposal.gain)}</p>
      </div>
    </div>
  );
}
