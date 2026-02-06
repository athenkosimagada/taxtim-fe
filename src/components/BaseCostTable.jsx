import { money } from "../lib/utils";

export default function BaseCostTable({ data }) {
  return (
    <table className="w-full bg-white rounded shadow text-sm">
      <thead className="bg-slate-100">
        <tr>
          <th className="text-start">Tax Year</th>
          <th className="text-start">Asset</th>
          <th className="text-start">Quantity</th>
          <th className="text-start">Base Cost</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(data).map(([year, assets]) =>
          Object.entries(assets).map(([asset, v]) => (
            <tr key={year + asset} className="border-t">
              <td>{year}</td>
              <td>{asset}</td>
              <td>{v.quantity}</td>
              <td>{money(v.cost)}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}
