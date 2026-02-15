import { Info } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-12">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-600" />
        How South African crypto tax works
      </h2>

      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-medium text-gray-900">
            Tax year runs 1 March – 28/29 February
          </p>
          <p className="text-gray-600 mt-1">This is the SARS tax period.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-medium text-gray-900">
            Only SELL and TRADE are taxable
          </p>
          <p className="text-gray-600 mt-1">BUY is not taxable.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-medium text-gray-900">FIFO method required</p>
          <p className="text-gray-600 mt-1">Oldest coins sold first.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-medium text-gray-900">
            Losses reduce taxable income
          </p>
          <p className="text-gray-600 mt-1">Gains can be offset.</p>
        </div>
      </div>
    </div>
  );
}
