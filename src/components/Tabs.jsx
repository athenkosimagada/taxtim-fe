export default function Tabs({ active, setActive }) {
  const tabs = [
    ["transactions", "Transactions"],
    ["baseCosts", "Base Costs"],
    ["gains", "Capital Gains"],
  ];

  return (
    <div className="flex gap-2 border-b mb-4">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={`px-4 py-2 ${
            active === id
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-slate-500"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
