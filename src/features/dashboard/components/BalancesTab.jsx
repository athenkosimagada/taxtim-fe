export default function BalancesTab({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {Object.entries(data).map(([coin, info]) => (
        <div key={coin} className="card">
          <h3 className="text-lg font-semibold mb-2">{coin}</h3>
          <div className="text-sm mb-1">Total you currently own: <strong>{info.totalQty}</strong></div>
          <div className="text-xs text-gray-500 mb-3">Each portion shows when and at what price it was bought.</div>
          <div className="text-xs text-gray-600 space-y-1">
            {info.lots.map((lot, idx) => (
              <div key={idx}>{lot.qty} @ R{lot.price} ({lot.date})</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
