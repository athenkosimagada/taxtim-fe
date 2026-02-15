import React from "react";
import { TrendingUp, Coins, Calendar, ArrowRight } from "lucide-react";
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

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
      <div className="text-right mb-8">
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-2 ml-auto"
        >
          Clear & start over
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

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

      <TransactionsList transactions={result.calculations} />
    </div>
  );
}
