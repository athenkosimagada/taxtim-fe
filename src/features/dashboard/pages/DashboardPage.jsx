import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import HowItWorks from "../components/HowItWorks";
import TransactionsSection from "../components/TransactionsSection";
import ResultsSection from "../components/ResultsSection";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
            <p className="text-lg font-medium text-gray-700">
              Calculating FIFO...
            </p>
          </div>
        ) : result ? (
          <ResultsSection
            loading={false}
            result={result}
            onClear={handleReset}
          />
        ) : (
          <>
            <DashboardHeader />
            <HowItWorks />
            <TransactionsSection
              setLoading={setLoading}
              setResult={setResult}
            />
          </>
        )}
      </div>
    </div>
  );
}
