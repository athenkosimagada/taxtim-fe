function getTaxYearRange(year) {
  const startYear = parseInt(year) - 1;
  return `1 March ${startYear} – 28 February ${year}`;
}

export default function SummaryTab({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {Object.entries(data.capitalGains).map(([year, coins]) => {
        const range = getTaxYearRange(year);
        const total = Object.values(coins).reduce((s, v) => s + Number(v), 0);

        return (
          <div key={year} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Tax Year {year}</h3>
                <div className="text-sm text-gray-600 mt-1">{range}</div>
              </div>

              <div className={`text-sm font-semibold ${total >= 0 ? "text-green-600" : "text-red-600"}`}>
                {total >= 0 ? `Total Profit: R ${total.toLocaleString()}` : `Total Loss: R ${Math.abs(total).toLocaleString()}`}
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-3">
              Only transactions where crypto was sold or traded in this period
              are included.
            </div>

            <div className="mt-3">
              {Object.entries(coins).map(([coin, amount]) => (
                <div key={coin} className="flex justify-between py-2">
                  <span className="text-sm">{coin}</span>
                  <span className={`font-medium ${amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R {Number(amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
