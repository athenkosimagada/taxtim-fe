import { FileText } from "lucide-react";

export default function PasteInput({ pasteData, onChange }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">
            Paste from Excel
          </h3>
          <p className="text-gray-900 text-xs mt-1">
            Copy and paste rows directly
          </p>
        </div>
      </div>

      <textarea
        value={pasteData}
        onChange={onChange}
        placeholder={`Date Type SellCoin SellAmount BuyCoin BuyAmount BuyPricePerCoin\n2024-06-01 BUY ZAR 10000 BTC 0.1 100000`}
        className="w-full h-32 bg-[#0F1E2C] border border-white/20 rounded-xl p-4 text-gray-900 text-sm placeholder:text-grey-600 transition resize-none"
      />
    </div>
  );
}
