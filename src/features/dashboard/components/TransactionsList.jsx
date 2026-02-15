import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function TransactionsList({ transactions }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
        <h4 className="text-gray-800 font-semibold text-lg">
          All Transactions ({transactions.length})
        </h4>
        <span className="text-gray-400 text-xs ml-2">
          — Sorted by date (oldest first)
        </span>
      </div>

      <div className="space-y-4">
        {transactions
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((tx, index) => {
            const isTaxable = tx.type === "SELL" || tx.type === "TRADE";

            const gain = tx.calculations?.capitalGain || 0;
            const lots = tx.calculations?.fifoLots || [];

            return (
              <div
                key={index}
                className={`bg-gray-50 rounded-xl border p-5 ${
                  isTaxable
                    ? "border-blue-200 hover:border-blue-300"
                    : "border-gray-200 hover:border-gray-300"
                } transition-all`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <span
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium min-w-[70px] text-center
                        ${tx.type === "BUY" ? "bg-gray-200 text-blue-500" : ""}
                        ${tx.type === "SELL" ? "bg-gray-200 text-red-500" : ""}
                        ${tx.type === "TRADE" ? "bg-gray-200 text-yellow-500" : ""}
                      `}
                    >
                      {tx.type}
                    </span>

                    {isTaxable ? (
                      <span className="flex items-center gap-1.5 text-red-500 text-xs bg-red-100 px-2.5 py-1.5 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Taxable event
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs bg-gray-100 px-2.5 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Not taxable
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 ml-0 sm:ml-auto">
                    <span className="text-gray-500 text-sm">
                      {new Date(tx.date).toLocaleDateString("en-ZA")}
                    </span>
                    {isTaxable && (
                      <span
                        className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                          gain >= 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {gain >= 0 ? "+" : ""}R
                        {Math.round(Math.abs(gain)).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Sold</p>
                    <p className="text-gray-800 font-medium">
                      {tx.sellCoin === "ZAR"
                        ? "R" + tx.sellAmount.toLocaleString()
                        : tx.sellAmount + " " + tx.sellCoin}
                    </p>
                  </div>

                  <div className="flex items-center justify-center text-gray-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Bought</p>
                    <p className="text-gray-800 font-medium">
                      {tx.buyCoin === "ZAR"
                        ? "R" + tx.buyAmount.toLocaleString()
                        : tx.buyAmount + " " + tx.buyCoin}
                    </p>
                    {tx.buyCoin !== "ZAR" && (
                      <p className="text-gray-500 text-xs mt-1">
                        @ R{Math.round(tx.pricePerCoin).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Total Value</p>
                    <p className="text-gray-800 font-medium">
                      R
                      {Math.round(
                        tx.type === "BUY"
                          ? tx.sellAmount
                          : tx.buyCoin === "ZAR"
                            ? tx.buyAmount
                            : tx.buyAmount * tx.pricePerCoin,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {isTaxable && lots.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <details className="group">
                      <summary className="flex items-center gap-2 text-blue-500 text-xs cursor-pointer hover:text-blue-600 transition list-none">
                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition" />
                        View FIFO calculation
                      </summary>

                      <div className="mt-4 bg-gray-100 rounded-lg p-4 text-gray-800 text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="py-2">Lot</th>
                              <th className="py-2">Date Acquired</th>
                              <th className="py-2 text-right">Amount</th>
                              <th className="py-2 text-right">Price (ZAR)</th>
                              <th className="py-2 text-right">Cost (ZAR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lots.map((lot, lotIdx) => (
                              <tr
                                key={lotIdx}
                                className="border-b border-gray-300"
                              >
                                <td className="py-2">{lotIdx + 1}</td>
                                <td className="py-2">
                                  {typeof lot.date === "string"
                                    ? lot.date.split(" ")[0]
                                    : lot.date}
                                </td>
                                <td className="py-2 text-right">
                                  {lot.amount} {tx.sellCoin}
                                </td>
                                <td className="py-2 text-right">
                                  R{Math.round(lot.price).toLocaleString()}
                                </td>
                                <td className="py-2 text-right font-medium">
                                  R{Math.round(lot.cost).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-gray-300">
                          <div>
                            <p className="text-gray-500 text-xs">Cost Basis</p>
                            <p className="font-semibold">
                              R
                              {Math.round(
                                tx.calculations.costBase,
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Proceeds</p>
                            <p className="font-semibold">
                              R
                              {Math.round(
                                tx.calculations.proceeds,
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">
                              Capital Gain
                            </p>
                            <p
                              className={`font-semibold ${
                                gain >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {gain >= 0 ? "+" : ""}R
                              {Math.round(Math.abs(gain)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
