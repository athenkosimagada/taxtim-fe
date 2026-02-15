import { Shield } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">T</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">TaxTim Crypto Tax</h1>
        <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
          <Shield className="w-4 h-4" />
          SARS FIFO Compliant · Free for South Africans
        </p>
      </div>
    </div>
  );
}
