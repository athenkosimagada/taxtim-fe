export function BaseCostTable({ data, title }) {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">{title}</h2>
      <table className="w-full text-sm border">
        <thead className="bg-slate-100">
          <tr>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Base Cost (ZAR)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([asset, v]) => (
            <tr key={asset}>
              <td>{asset}</td>
              <td>{v.quantity}</td>
              <td>{v.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
