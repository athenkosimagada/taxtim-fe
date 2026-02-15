import { ArrowRight, Calculator, Clock } from "lucide-react";

export default function CalculateButton({ onClick, disabled }) {
  return (
    <div className="flex flex-col items-center mb-10">
      <button
        disabled={disabled}
        onClick={onClick}
        className="disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer bg-[#3B82F6] hover:bg-blue-700 text-white px-12 py-5 rounded-full font-semibold transition flex items-center gap-3 shadow-md text-lg"
      >
        <Calculator className="w-6 h-6" />
        Calculate Your Tax
        <ArrowRight className="w-6 h-6" />
      </button>
      <p className="text-grey-900 text-sm mt-4 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Takes about 60 seconds · SARS FIFO method
      </p>
    </div>
  );
}
