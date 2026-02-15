import { CheckCircle } from "lucide-react";

export default function ResultsHeader({ length }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <h3 className="text-gray-900 font-semibold text-xl flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        Your Complete Transaction History
      </h3>
      <span className="bg-[#3B82F6]/20 text-blue-600 px-4 py-2 rounded-full text-xs border border-[#3B82F6]/30">
        {length} total transactions · SARS FIFO
      </span>
    </div>
  );
}
