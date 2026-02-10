export default function TransactionsSummary() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Transactions Summary</h2>
      <p className="text-gray-600">
        You have uploaded 120 transactions this month.
      </p>
      <p className="text-gray-600">Your total expenses are $5,000.</p>
      <p className="text-gray-600">Your total income is $7,000.</p>
    </div>
  );
}
