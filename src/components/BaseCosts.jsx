export default function BaseCosts({ snapshots }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="font-semibold text-lg mb-3">
        Base Cost Balances (1 March)
      </h2>

      {Object.entries(snapshots).map(([year, assets]) => (
        <div key={year} className="mb-4">
          <h3 className="font-medium">As at 1 March {year}</h3>

          <table className="text-sm mt-2">
            <tbody>
              {Object.entries(assets).map(([asset, v]) => (
                <tr key={asset}>
                  <td className="pr-4">{asset}</td>
                  <td>
                    {v.quantity} → R{v.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
