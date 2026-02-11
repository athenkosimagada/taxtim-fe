import * as XLSX from "xlsx";
import { parseNumber, parsePrice, normalizeDate } from "./parseTransactions";

export function parseTransactionsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (!rows || rows.length < 2) {
          return reject(new Error("Excel file appears empty or missing data"));
        }

        const [, ...dataRows] = rows;
        const transactions = [];

        dataRows.forEach((row, idx) => {
          if (!row || !row.some((cell) => cell != null && cell !== "")) return;

          while (row.length < 7) row.push(null);

          const [
            date,
            type,
            sellCoin,
            sellAmount,
            buyCoin,
            buyAmount,
            buyPricePerCoin,
          ] = row;

          if (!type) return;

          const parsedSellAmount = parseNumber(sellAmount);
          const parsedBuyAmount = parseNumber(buyAmount);
          const parsedPrice = parsePrice(buyPricePerCoin);
          const parsedDate = normalizeDate(date);

          if (parsedSellAmount == null && parsedBuyAmount == null) return;

          transactions.push({
            date: parsedDate,
            type: type.toString().trim(),
            sellCoin: sellCoin?.toString().trim(),
            sellAmount: parsedSellAmount,
            buyCoin: buyCoin?.toString().trim(),
            buyAmount: parsedBuyAmount,
            pricePerCoin: parsedPrice,
          });
        });

        if (!transactions.length) {
          return reject(
            new Error(
              "No valid transactions found. Please check your Excel rows or pasted text.",
            ),
          );
        }

        resolve(transactions);
      } catch (err) {
        reject(
          new Error(
            "Invalid Excel file format or data. Make sure you have the correct columns.",
          ),
        );
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsBinaryString(file);
  });
}
