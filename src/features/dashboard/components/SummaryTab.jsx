function getTaxYearRange(year) {
  const startYear = parseInt(year) - 1;
  return `1 March ${startYear} – 28 February ${year}`;
}

export default function SummaryTab({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {Object.entries(data.capitalGains).map(([year, coins]) => {
        const range = getTaxYearRange(year);
        const txCount = data.taxYearTransactionCount?.[year] ?? 0;

        return (
          <div key={year} className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold">Tax Year {year}</h3>
            <div className="text-sm text-gray-600 mt-1">{range}</div>

            <div className="text-xs text-gray-500 mt-3">
              Only transactions where crypto was sold or traded in this period
              are included.
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {txCount} transaction(s) were used to calculate profit/loss.
            </div>

            {Object.entries(coins).map(([coin, amount]) => (
              <div key={coin} className="flex justify-between py-1">
                <span>{coin}</span>
                <span
                  className={`font-medium ${amount >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {amount >= 0 ? "Total Profit: " : "Total Loss: "} R{" "}
                  {amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
