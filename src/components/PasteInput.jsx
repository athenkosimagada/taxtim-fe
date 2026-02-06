export default function PasteInput({ value, onChange }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Step 1: Paste Transactions</h2>

      <p className="text-sm text-slate-600 mb-3">
        Copy directly from Excel and paste below.
      </p>

      <textarea
        className="w-full h-44 border rounded p-3 font-mono text-sm"
        placeholder="Paste Excel rows here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
