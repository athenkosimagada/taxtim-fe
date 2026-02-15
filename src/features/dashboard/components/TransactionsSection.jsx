import { useState, useRef } from "react";
import CalculateButton from "./CalculateButton";
import FileUpload from "./FileUpload";
import PasteInput from "./PasteInput";
import TrabsactionsTypes from "./TrabsactionsTypes";
import { readExcelFile } from "../utils/readExcelFile";
import { parsePastedData } from "../utils/parsePastedData";
import {
  calculateTransactions,
  deleteAllTransactions,
  postTransactions,
} from "../services/transactions.api";

export default function TransactionsSection({ setLoading, setResult }) {
  const [fileName, setFileName] = useState(null);
  const [pasteData, setPasteData] = useState("");

  const fileInputRef = useRef(null);

  const handleClearUpload = () => {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPasteData("");
  };

  const handleTextChange = (event) => {
    setPasteData(event.target.value);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCalculate = async () => {
    if (!pasteData.trim() && !fileName) return;

    setLoading(true);

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      let transactions = [];

      if (pasteData.trim()) {
        transactions = parsePastedData(pasteData);
      } else {
        const file = fileInputRef.current?.files?.[0];
        transactions = await readExcelFile(file);
      }

      await deleteAllTransactions();
      await postTransactions(transactions);

      const response = await calculateTransactions();

      setResult(response);
    } catch (error) {
      console.error("Error processing transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#3B82F6] rounded-full"></span>
        Add Your Transactions
      </h2>

      <TrabsactionsTypes />

      <div className="grid md:grid-cols-1 gap-6">
        <FileUpload
          fileName={fileName}
          fileInputRef={fileInputRef}
          onFileChange={handleFileUpload}
          onClear={handleClearUpload}
        />

        <PasteInput pasteData={pasteData} onChange={handleTextChange} />
      </div>

      <CalculateButton
        disabled={!pasteData.trim() && !fileName}
        onClick={handleCalculate}
      />
    </div>
  );
}
