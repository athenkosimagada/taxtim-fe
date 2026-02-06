export default function CapitalGainsSummary({ capitalGains }) {
  console.log("Rendering CapitalGainsSummary with:", capitalGains);
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="font-semibold text-lg mb-3">Capital Gains per Tax Year</h2>

      {Object.entries(capitalGains).map(([year, assets]) => (
        <div key={year} className="mb-4">
          <h3 className="font-medium">Tax Year {year}</h3>

          <table className="text-sm mt-2">
            <tbody>
              {Object.entries(assets).map(([asset, value]) => (
                <tr key={asset}>
                  <td className="pr-4">{asset}</td>
                  <td className="font-semibold">R{value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
