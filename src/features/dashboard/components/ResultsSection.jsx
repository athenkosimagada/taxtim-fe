import { TrendingUp, Coins, Calendar, ArrowRight } from "lucide-react";
import * as XLSX from "xlsx";
import TransactionsList from "./TransactionsList";

export default function ResultsSection({ loading, result, onClear }) {
  if (loading) {
    return (
      <div className="absolute inset-0 z-10000 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        Calculating FIFO...
      </div>
    );
  }

  if (!result) return null;

  const totalGain = Object.values(result.capitalGains || {}).reduce(
    (sum, yearObj) =>
      sum +
      Object.values(yearObj).reduce(
        (yearSum, coinGain) => yearSum + coinGain,
        0,
      ),
    0,
  );

  // ===== FULL EXCEL EXPORT =====
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // --- 1. Summary Sheet ---
    const summaryData = [
      { Metric: "Total Capital Gain", Value: totalGain },
      ...Object.entries(result.balances).map(([coin, data]) => ({
        Metric: `Balance - ${coin}`,
        Value: data?.totalQty ?? 0,
      })),
      ...Object.keys(result.capitalGains || {}).map((year) => ({
        Metric: `Tax Year`,
        Value: year,
      })),
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    // --- 2. Transactions Sheet ---
    if (result.calculations && result.calculations.length > 0) {
      const transactionsData = result.calculations.map((tx, index) => ({
        Index: index + 1,
        Date: tx.date,
        Type: tx.type,
        "Sell Coin": tx.sellCoin,
        "Sell Amount": tx.sellAmount,
        "Buy Coin": tx.buyCoin,
        "Buy Amount": tx.buyAmount,
        "Price per Coin": tx.pricePerCoin,
        Proceeds: tx.calculations?.proceeds,
        "Cost Base": tx.calculations?.costBase,
        "Capital Gain": tx.calculations?.capitalGain,
        Lots: tx.calculations?.lots ? JSON.stringify(tx.calculations.lots) : "",
      }));
      const txSheet = XLSX.utils.json_to_sheet(transactionsData);
      XLSX.utils.book_append_sheet(workbook, txSheet, "Transactions");
    }

    // --- 3. Capital Gains Sheet ---
    const cgData = [];
    for (const [year, coins] of Object.entries(result.capitalGains || {})) {
      for (const [coin, gain] of Object.entries(coins)) {
        cgData.push({ Year: year, Coin: coin, "Capital Gain": gain });
      }
    }
    if (cgData.length > 0) {
      const cgSheet = XLSX.utils.json_to_sheet(cgData);
      XLSX.utils.book_append_sheet(workbook, cgSheet, "Capital Gains");
    }

    // Write file
    XLSX.writeFile(workbook, "taxtim_results.xlsx");
  };

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-2"
        >
          Clear & start over
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={downloadExcel}
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold shadow"
        >
          Download Excel
        </button>
      </div>

      {/* Summary Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Total Capital Gain
          </p>
          <p
            className={`text-3xl font-bold ${
              totalGain >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalGain >= 0 ? "+" : ""}R
            {Math.round(Math.abs(totalGain)).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
            <Coins className="w-4 h-4" />
            Remaining Balances
          </p>
          {Object.entries(result.balances).map(([coin, data]) => (
            <p key={coin} className="text-gray-800 font-semibold">
              {data?.totalQty} {coin}
            </p>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Tax Years
          </p>
          {Object.keys(result.capitalGains || {}).map((year) => (
            <p key={year} className="text-gray-800">
              {year}
            </p>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <TransactionsList transactions={result.calculations} />
    </div>
  );
}
