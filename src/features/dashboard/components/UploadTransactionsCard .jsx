export default function UploadTransactionsCard() {
  return (
    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
      <h2 className="text-xl font-semibold mb-2">Upload Your Transactions</h2>

      <p className="text-gray-700 mb-4">
        Upload an Excel (.xlsx) file with your crypto transactions.
      </p>

      <input type="file" accept=".xlsx" className="block w-full text-lg" />

      <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl text-lg">
        Upload File
      </button>
    </div>
  );
}
