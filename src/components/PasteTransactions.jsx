export default function PasteTransactions({
  value,
  onChange,
  onCalculate,
  onClear,
}) {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">1. Paste Transactions (from Excel)</h2>

      <textarea
        className="w-full border rounded p-2 text-sm h-40"
        placeholder="Paste Excel data here (tab-separated)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="mt-3 flex gap-3">
        <button
          onClick={onCalculate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>

        <button
          onClick={onClear}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear & Restart
        </button>
      </div>
    </section>
  );
}
