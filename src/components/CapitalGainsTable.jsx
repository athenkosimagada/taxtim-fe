import { money } from "../lib/utils";

export default function CapitalGainsTable({ data }) {
  return (
    <table className="w-full bg-white rounded shadow text-sm">
      <thead className="bg-slate-100">
        <tr>
          <th className="text-start">Asset</th>
          <th className="text-start">Gain / Loss</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(data).map(([asset, v]) => (
          <tr key={asset} className="border-t">
            <td>{asset}</td>
            <td className="font-semibold">{money(v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
