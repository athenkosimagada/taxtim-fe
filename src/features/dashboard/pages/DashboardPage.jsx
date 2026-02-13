import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Calculator,
  ArrowRight,
  Download,
  TrendingUp,
  Coins,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Shield,
  Info,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const [fileName, setFileName] = useState("");
  const [pasteData, setPasteData] = useState("");
  const [parsedTransactions, setParsedTransactions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const transactions = parseExcelData(jsonData);
        setParsedTransactions(transactions);

        if (transactions.length === 0) {
          setUploadError("No valid transactions found in file");
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        setUploadError("Failed to parse file. Please check the format.");
        setFileName("");
      }
    };

    reader.onerror = () => {
      setUploadError("Failed to read file");
      setFileName("");
    };

    reader.readAsBinaryString(file);
  };

  const handlePasteChange = (e) => {
    const text = e.target.value;
    setPasteData(text);

    if (text.trim()) {
      try {
        const rows = text
          .split("\n")
          .map((row) => row.split("\t").map((cell) => cell.trim()))
          .filter((row) => row.length > 1 && row[0] !== "");

        const transactions = parseExcelData(rows);
        setParsedTransactions(transactions);
        setUploadError("");
      } catch (error) {
        console.error("Error parsing paste:", error);
      }
    } else {
      setParsedTransactions([]);
    }
  };

  const parseExcelData = (data) => {
    if (!data || data.length < 2) return [];

    const transactions = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 7) continue;
      if (!row[0] || !row[1]) continue;

      try {
        const transaction = {
          date: row[0]?.toString() || "",
          type: row[1]?.toString()?.toUpperCase() || "",
          sellCoin: row[2]?.toString() || "",
          sellAmount: parseFloat(row[3]?.toString().replace(",", ".")) || 0,
          buyCoin: row[4]?.toString() || "",
          buyAmount: parseFloat(row[5]?.toString().replace(",", ".")) || 0,
          buyPricePerCoin:
            parseFloat(row[6]?.toString().replace(/[R\s,]/g, "")) || 0,
        };

        if (typeof row[5] === "string" && row[5].startsWith("=")) {
          const sellAmount = transaction.sellAmount;
          const price = transaction.buyPricePerCoin;
          transaction.buyAmount = price > 0 ? sellAmount / price : 0;
        }

        if (transaction.type && transaction.date) {
          transactions.push(transaction);
        }
      } catch (e) {
        console.warn("Skipping row:", row);
      }
    }

    return transactions;
  };

  const calculateFIFO = (transactions) => {
    const lots = {};
    const trades = [];
    let totalGain = 0;

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    sorted.forEach((tx, index) => {
      if (tx.type === "BUY") {
        if (!lots[tx.buyCoin]) lots[tx.buyCoin] = [];
        lots[tx.buyCoin].push({
          date: tx.date,
          amount: tx.buyAmount,
          price: tx.buyPricePerCoin,
          remaining: tx.buyAmount,
        });
      } else if (tx.type === "SELL") {
        let amountToSell = tx.sellAmount;
        let costBasis = 0;
        const usedLots = [];

        while (amountToSell > 0.0000001 && lots[tx.sellCoin]?.length > 0) {
          const lot = lots[tx.sellCoin][0];
          const sellAmount = Math.min(lot.remaining, amountToSell);
          const lotCost = sellAmount * lot.price;

          costBasis += lotCost;
          amountToSell -= sellAmount;
          lot.remaining -= sellAmount;

          usedLots.push({
            date: lot.date,
            amount: sellAmount,
            price: lot.price,
            cost: lotCost,
          });

          if (lot.remaining < 0.0000001) {
            lots[tx.sellCoin].shift();
          }
        }

        const proceeds = tx.buyAmount;
        const gain = proceeds - costBasis;
        totalGain += gain;

        trades.push({
          id: index,
          date: tx.date,
          type: "SELL",
          coin: tx.sellCoin,
          amount: tx.sellAmount,
          proceeds,
          costBasis,
          gain,
          usedLots,
        });
      } else if (tx.type === "TRADE") {
        let amountToSell = tx.sellAmount;
        let costBasis = 0;
        const usedLots = [];

        while (amountToSell > 0.0000001 && lots[tx.sellCoin]?.length > 0) {
          const lot = lots[tx.sellCoin][0];
          const sellAmount = Math.min(lot.remaining, amountToSell);
          const lotCost = sellAmount * lot.price;

          costBasis += lotCost;
          amountToSell -= sellAmount;
          lot.remaining -= sellAmount;

          usedLots.push({
            date: lot.date,
            amount: sellAmount,
            price: lot.price,
            cost: lotCost,
          });

          if (lot.remaining < 0.0000001) {
            lots[tx.sellCoin].shift();
          }
        }

        if (!lots[tx.buyCoin]) lots[tx.buyCoin] = [];
        lots[tx.buyCoin].push({
          date: tx.date,
          amount: tx.buyAmount,
          price: tx.buyPricePerCoin,
          remaining: tx.buyAmount,
        });

        const proceeds = tx.buyAmount * tx.buyPricePerCoin;
        const gain = proceeds - costBasis;
        totalGain += gain;

        trades.push({
          id: index,
          date: tx.date,
          type: "TRADE",
          fromCoin: tx.sellCoin,
          fromAmount: tx.sellAmount,
          toCoin: tx.buyCoin,
          toAmount: tx.buyAmount,
          toPrice: tx.buyPricePerCoin,
          proceeds,
          costBasis,
          gain,
          usedLots,
        });
      }
    });

    const baseCosts = {};
    const balances = {};

    Object.keys(lots).forEach((coin) => {
      balances[coin] = lots[coin].reduce((sum, lot) => sum + lot.remaining, 0);
      baseCosts[coin] = lots[coin].reduce(
        (sum, lot) => sum + lot.remaining * lot.price,
        0,
      );
    });

    return {
      trades,
      totalGain,
      baseCosts,
      balances,
      lots,
    };
  };

  const handleCalculate = () => {
    if (parsedTransactions.length === 0) {
      alert("Please upload an Excel file or paste transactions first.");
      return;
    }

    const result = calculateFIFO(parsedTransactions);
    setCalculationResult(result);
    setShowResults(true);
  };

  const handleClear = () => {
    setFileName("");
    setPasteData("");
    setParsedTransactions([]);
    setShowResults(false);
    setCalculationResult(null);
    setUploadError("");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">T</span>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                TaxTim Crypto Tax
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4" />
                SARS FIFO Compliant · Free for South Africans
              </p>
            </div>
          </div>

          {parsedTransactions.length > 0 && (
            <div className="inline-flex items-center bg-green-100 text-green-700 border border-green-200 px-4 py-2 rounded-full text-xs">
              <CheckCircle className="w-4 h-4 mr-2" />
              {parsedTransactions.length} transactions loaded
            </div>
          )}

          {uploadError && (
            <div className="inline-flex items-center bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-full text-xs mt-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              {uploadError}
            </div>
          )}
        </div>

        {/* HOW IT WORKS */}
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

        {/* Add Transactions Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#3B82F6] rounded-full"></span>
            Add Your Transactions
          </h2>

          <div className="grid md:grid-cols-1 gap-6">
            {/* Upload Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">
                    Upload Excel file
                  </h3>
                  <p className="text-gray-900 text-xs mt-1">
                    .xlsx, .xls, .csv up to 10MB
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-900 rounded-xl p-8 text-center hover:border-[#3B82F6]/50 transition group">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <Upload className="w-10 h-10 text-gray-900 mx-auto mb-3 group-hover:text-[#93C5FD] transition" />
                  <p className="text-gray-900 text-sm mb-1">
                    Choose file or drag & drop
                  </p>
                  <p className="text-white/40 text-xs">Click to browse</p>
                </label>
                {fileName && (
                  <div className="mt-4 rounded-lg p-3 flex items-center justify-between border border-[#3B82F6]/30">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#93C5FD]" />
                      <span className="text-gray-900 text-sm truncate max-w-[200px]">
                        {fileName}
                      </span>
                    </div>
                    <button
                      onClick={() => setFileName("")}
                      className="text-gray-900 hover:text-gray-600 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Paste Card */}
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
                onChange={handlePasteChange}
                placeholder="Date | Type | SellCoin | SellAmount | BuyCoin | BuyAmount | BuyPricePerCoin"
                className="w-full h-32 bg-[#0F1E2C] border border-white/20 rounded-xl p-4 text-gray-900 text-sm placeholder:text-grey-600 transition resize-none"
              />

              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-grey-900 text-xs mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Transaction types:
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#3B82F6]/20 px-2 py-1 rounded-full">
                    <span className="text-blue-600 text-xs font-medium">
                      BUY
                    </span>
                    <span className="text-grey-900 text-xs">→</span>
                    <span className="text-grey-900 text-xs">Not taxable</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#3B82F6]/20 px-2 py-1 rounded-full">
                    <span className="text-red-600 text-xs font-medium">
                      SELL
                    </span>
                    <span className="text-grey-900 text-xs">→</span>
                    <span className="text-grey-900 text-xs">Taxable</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#3B82F6]/20 px-2 py-1 rounded-full">
                    <span className="text-yellow-500 text-xs font-medium">
                      TRADE
                    </span>
                    <span className="text-grey-900 text-xs">→</span>
                    <span className="text-grey-900 text-xs">Taxable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex flex-col items-center mb-10">
          <button
            onClick={handleCalculate}
            disabled={parsedTransactions.length === 0}
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

        {/* Results Section - SHOW EVERYTHING */}
        {showResults && calculationResult && (
          <div className="bg-[#13293D] rounded-2xl p-6 md:p-8 border border-[#3B82F6]/30 shadow-2xl">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h3 className="text-white font-semibold text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                Your Complete Transaction History
              </h3>
              <span className="bg-[#1E3A5F] text-[#93C5FD] px-4 py-2 rounded-full text-xs border border-[#3B82F6]/30">
                {parsedTransactions.length} total transactions · SARS FIFO
              </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#0F1E2C] rounded-xl p-5 border border-white/5 hover:border-[#3B82F6]/30 transition">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Total Capital Gain
                </p>
                <p
                  className={`text-3xl font-bold ${calculationResult.totalGain >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {calculationResult.totalGain >= 0 ? "+" : ""}R
                  {Math.round(
                    Math.abs(calculationResult.totalGain),
                  ).toLocaleString()}
                </p>
                <p className="text-white/30 text-xs mt-2">2025 tax year</p>
              </div>
              <div className="bg-[#0F1E2C] rounded-xl p-5 border border-white/5 hover:border-[#3B82F6]/30 transition">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5" />
                  Taxable Events
                </p>
                <p className="text-3xl font-bold text-white">
                  {calculationResult.trades?.length || 0}
                </p>
                <p className="text-white/30 text-xs mt-2">SELL + TRADE</p>
              </div>
              <div className="bg-[#0F1E2C] rounded-xl p-5 border border-white/5 hover:border-[#3B82F6]/30 transition">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  Base Cost (BTC)
                </p>
                <p className="text-2xl font-bold text-white">
                  R
                  {Math.round(
                    calculationResult.baseCosts?.BTC || 0,
                  ).toLocaleString()}
                </p>
                <p className="text-white/30 text-xs mt-2">@ 1 Mar 2025</p>
              </div>
              <div className="bg-[#0F1E2C] rounded-xl p-5 border border-white/5 hover:border-[#3B82F6]/30 transition">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Remaining BTC
                </p>
                <p className="text-2xl font-bold text-white">
                  {calculationResult.balances?.BTC?.toFixed(3) || 0} BTC
                </p>
                <p className="text-white/30 text-xs mt-2">
                  {calculationResult.balances?.ETH?.toFixed(2) || 0} ETH
                </p>
              </div>
            </div>

            {/* ALL TRANSACTIONS - Complete History */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#93C5FD]" />
                </div>
                <h4 className="text-white font-semibold text-lg">
                  All Transactions ({parsedTransactions.length})
                </h4>
                <span className="text-white/40 text-xs ml-2">
                  — Sorted by date (oldest first)
                </span>
              </div>

              <div className="space-y-4">
                {parsedTransactions
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((tx, index) => {
                    // Find matching trade for this transaction (if taxable)
                    const matchingTrade = calculationResult.trades?.find(
                      (t) =>
                        t.date === tx.date &&
                        ((t.type === "SELL" && t.coin === tx.sellCoin) ||
                          (t.type === "TRADE" &&
                            t.fromCoin === tx.sellCoin &&
                            t.toCoin === tx.buyCoin)),
                    );

                    const isTaxable = tx.type === "SELL" || tx.type === "TRADE";
                    const gain = matchingTrade?.gain || 0;

                    return (
                      <div
                        key={index}
                        className={`
                          bg-[#0F1E2C] rounded-xl border p-5 
                          ${
                            isTaxable
                              ? "border-[#3B82F6]/40 hover:border-[#3B82F6]"
                              : "border-white/10 hover:border-white/20"
                          } 
                          transition-all
                        `}
                      >
                        {/* Transaction Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-start sm:items-center gap-4">
                            {/* Type Badge */}
                            <span
                              className={`
                              px-3 py-1.5 rounded-full text-xs font-medium min-w-[70px] text-center
                              ${tx.type === "BUY" ? "bg-[#1E3A5F] text-[#93C5FD] border border-[#93C5FD]/30" : ""}
                              ${tx.type === "SELL" ? "bg-[#1E3A5F] text-[#F87171] border border-[#F87171]/30" : ""}
                              ${tx.type === "TRADE" ? "bg-[#1E3A5F] text-[#FBBF24] border border-[#FBBF24]/30" : ""}
                            `}
                            >
                              {tx.type}
                            </span>

                            {/* Taxable Indicator */}
                            {isTaxable ? (
                              <span className="flex items-center gap-1.5 text-[#F87171] text-xs bg-[#F87171]/10 px-2.5 py-1.5 rounded-full">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Taxable event
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-white/40 text-xs bg-white/5 px-2.5 py-1.5 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Not taxable
                              </span>
                            )}
                          </div>

                          {/* Date & Gain */}
                          <div className="flex items-center gap-4 ml-0 sm:ml-auto">
                            <span className="text-white/50 text-sm">
                              {new Date(tx.date).toLocaleDateString("en-ZA")}
                            </span>
                            {isTaxable && (
                              <span
                                className={`text-sm font-semibold px-3 py-1.5 rounded-full
                                ${gain >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                              `}
                              >
                                {gain >= 0 ? "+" : ""}R
                                {Math.round(Math.abs(gain)).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Transaction Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          {/* Sell Side */}
                          <div className="bg-[#0B1E33] rounded-lg p-3">
                            <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#F87171] rounded-full"></span>
                              Sold
                            </p>
                            <p className="text-white font-medium">
                              {tx.sellCoin === "ZAR"
                                ? "R" + tx.sellAmount.toLocaleString()
                                : tx.sellAmount.toFixed(4) + " " + tx.sellCoin}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="flex items-center justify-center text-white/30">
                            <ArrowRight className="w-4 h-4" />
                          </div>

                          {/* Buy Side */}
                          <div className="bg-[#0B1E33] rounded-lg p-3">
                            <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></span>
                              Bought
                            </p>
                            <p className="text-white font-medium">
                              {tx.buyCoin === "ZAR"
                                ? "R" + tx.buyAmount.toLocaleString()
                                : tx.buyAmount.toFixed(4) + " " + tx.buyCoin}
                            </p>
                            {tx.buyCoin !== "ZAR" && (
                              <p className="text-white/40 text-xs mt-1">
                                @ R
                                {Math.round(
                                  tx.buyPricePerCoin,
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>

                          {/* Total Value */}
                          <div className="bg-[#0B1E33] rounded-lg p-3">
                            <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#93C5FD] rounded-full"></span>
                              Total Value
                            </p>
                            <p className="text-white font-medium">
                              R
                              {Math.round(
                                tx.type === "BUY"
                                  ? tx.sellAmount
                                  : tx.buyCoin === "ZAR"
                                    ? tx.buyAmount
                                    : tx.buyAmount * tx.buyPricePerCoin,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* FIFO Breakdown for Taxable Events */}
                        {isTaxable &&
                          matchingTrade &&
                          matchingTrade.usedLots?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <details className="group">
                                <summary className="flex items-center gap-2 text-[#93C5FD] text-xs cursor-pointer hover:text-white transition list-none">
                                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition" />
                                  View FIFO calculation
                                </summary>
                                <div className="mt-4 bg-[#0B1E33] rounded-lg p-4">
                                  <p className="text-white/60 text-xs mb-3">
                                    SARS requires you to sell your{" "}
                                    <span className="text-[#93C5FD] font-medium">
                                      oldest coins first (FIFO)
                                    </span>
                                    . Here's how we calculated your gain:
                                  </p>

                                  <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="border-b border-white/10">
                                          <th className="text-left py-2 text-white/50 font-medium">
                                            Lot
                                          </th>
                                          <th className="text-left py-2 text-white/50 font-medium">
                                            Date Acquired
                                          </th>
                                          <th className="text-right py-2 text-white/50 font-medium">
                                            Amount
                                          </th>
                                          <th className="text-right py-2 text-white/50 font-medium">
                                            Price (ZAR)
                                          </th>
                                          <th className="text-right py-2 text-white/50 font-medium">
                                            Cost (ZAR)
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {matchingTrade.usedLots.map(
                                          (lot, lotIdx) => (
                                            <tr
                                              key={lotIdx}
                                              className="border-b border-white/10 hover:bg-white/5"
                                            >
                                              <td className="py-2 text-white">
                                                Lot {lotIdx + 1}
                                              </td>
                                              <td className="py-2 text-white/70">
                                                {typeof lot.date === "string"
                                                  ? lot.date.split(" ")[0]
                                                  : lot.date}
                                              </td>
                                              <td className="py-2 text-right text-white">
                                                {lot.amount.toFixed(4)}{" "}
                                                {matchingTrade.fromCoin ||
                                                  matchingTrade.coin}
                                              </td>
                                              <td className="py-2 text-right text-white/70">
                                                R
                                                {Math.round(
                                                  lot.price,
                                                ).toLocaleString()}
                                              </td>
                                              <td className="py-2 text-right text-white font-medium">
                                                R
                                                {Math.round(
                                                  lot.cost,
                                                ).toLocaleString()}
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-white/10">
                                    <div>
                                      <p className="text-white/50 text-xs">
                                        Cost Basis
                                      </p>
                                      <p className="text-white font-semibold">
                                        R
                                        {Math.round(
                                          matchingTrade.costBasis,
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-xs">
                                        Proceeds
                                      </p>
                                      <p className="text-white font-semibold">
                                        {matchingTrade.type === "TRADE"
                                          ? `R${Math.round(matchingTrade.proceeds).toLocaleString()}`
                                          : `R${Math.round(matchingTrade.proceeds).toLocaleString()}`}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-xs">
                                        Capital Gain
                                      </p>
                                      <p
                                        className={`font-semibold ${matchingTrade.gain >= 0 ? "text-green-400" : "text-red-400"}`}
                                      >
                                        {matchingTrade.gain >= 0 ? "+" : ""}R
                                        {Math.round(
                                          Math.abs(matchingTrade.gain),
                                        ).toLocaleString()}
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

            {/* Tax Year Summary */}
            <div className="bg-gradient-to-r from-[#1E3A5F]/50 to-[#162B44]/50 rounded-xl p-5 mt-6 border border-[#3B82F6]/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#93C5FD]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">2025 Tax Year</p>
                    <p className="text-white/50 text-xs">
                      1 March 2024 – 28 February 2025
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#0B1E33] px-5 py-3 rounded-xl">
                  <span className="text-white/50 text-sm">
                    Total Capital Gain:
                  </span>
                  <span
                    className={`font-bold text-2xl ${calculationResult.totalGain >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {calculationResult.totalGain >= 0 ? "+" : ""}R
                    {Math.round(
                      Math.abs(calculationResult.totalGain),
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <div className="text-right mt-8">
              <button
                onClick={handleClear}
                className="text-white/40 hover:text-white/60 text-sm transition flex items-center gap-2 ml-auto group bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full"
              >
                Clear & start over
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
