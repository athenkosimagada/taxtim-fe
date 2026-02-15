import { Info } from "lucide-react";

export default function TrabsactionsTypes() {
  return (
    <div className="mt-5 mb-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
      <p className="text-grey-900 text-xs mb-3 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-blue-600" />
        Transaction types:
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#3B82F6]/20 px-2 py-1 rounded-full">
          <span className="text-blue-600 text-xs font-medium">BUY</span>
          <span className="text-grey-900 text-xs">→</span>
          <span className="text-grey-900 text-xs">Not taxable</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#3B82F6]/20 px-2 py-1 rounded-full">
          <span className="text-red-600 text-xs font-medium">SELL</span>
          <span className="text-grey-900 text-xs">→</span>
          <span className="text-grey-900 text-xs">Taxable</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#3B82F6]/20 px-2 py-1 rounded-full">
          <span className="text-yellow-500 text-xs font-medium">TRADE</span>
          <span className="text-grey-900 text-xs">→</span>
          <span className="text-grey-900 text-xs">Taxable</span>
        </div>
      </div>
    </div>
  );
}
