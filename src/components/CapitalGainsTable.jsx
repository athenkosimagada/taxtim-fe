export function CapitalGainsTable({ data }) {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Capital Gains</h2>
      <ul>
        {Object.entries(data).map(([asset, value]) => (
          <li key={asset} className="flex justify-between">
            <span>{asset}</span>
            <span className="font-semibold">R{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
