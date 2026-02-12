import * as XLSX from "xlsx";

function excelSerialToDateOnly(serial) {
  if (!serial) return null;

  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);

  return date.toISOString().split("T")[0];
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") return 0;

  if (typeof value === "number") return value;

  return parseFloat(
    value.toString().replace(/R/gi, "").replace(/,/g, "").trim(),
  );
}

function normalizeType(type) {
  if (!type) return null;
  return type.toString().trim().toUpperCase();
}

export function parseTransactionsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;

        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, {
          raw: true,
          defval: "",
        });

        if (!rows.length) {
          throw new Error("Excel file is empty.");
        }

        const transactions = rows
          .map((row, index) => {
            const {
              Date,
              Type,
              SellCoin,
              SellAmount,
              BuyCoin,
              BuyAmount,
              BuyPricePerCoin,
            } = row;

            const type = normalizeType(Type);
            if (!type) return null;

            const sellCoin = SellCoin?.toString().trim();
            const buyCoin = BuyCoin?.toString().trim();

            const sellAmount = parseNumber(SellAmount);
            const buyAmount = parseNumber(BuyAmount);
            const pricePerCoin = parseNumber(BuyPricePerCoin);

            let normalizedDate = null;

            if (typeof Date === "number") {
              normalizedDate = excelSerialToDateOnly(Date);
            } else if (Date) {
              const parsed = new Date(Date);
              if (!isNaN(parsed)) {
                normalizedDate = parsed.toISOString().split("T")[0];
              }
            }

            if (!normalizedDate) {
              throw new Error(`Invalid date format in row ${index + 2}`);
            }

            return {
              date: normalizedDate,
              type,
              sellCoin,
              sellAmount,
              buyCoin,
              buyAmount,
              pricePerCoin,
            };
          })
          .filter(Boolean);

        if (!transactions.length) {
          throw new Error("No valid transactions found.");
        }

        resolve(transactions);
      } catch (err) {
        reject(
          new Error(
            err.message ||
              "Invalid Excel file format. Please check column names and values.",
          ),
        );
      }
    };

    reader.onerror = () => reject(new Error("Failed to read Excel file."));

    reader.readAsArrayBuffer(file);
  });
}
