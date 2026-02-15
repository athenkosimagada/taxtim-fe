const excelDateToJS = (excelDate) => {
  if (!excelDate) return null;
  const days = Math.floor(excelDate - 25569);
  const ms = days * 24 * 60 * 60 * 1000;
  const date = new Date(ms);
  const fraction = excelDate - Math.floor(excelDate);
  date.setSeconds(date.getSeconds() + Math.round(fraction * 24 * 60 * 60));
  return date;
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const parseExcelData = (data) => {
  if (!data || data.length < 2) return [];

  const transactions = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 7) continue;
    if (!row[0] || !row[1]) continue;

    try {
      let rawDate = row[0]?.toString() || "";
      let jsDate =
        !isNaN(Number(rawDate)) && Number(rawDate) > 31
          ? excelDateToJS(Number(rawDate))
          : new Date(rawDate);

      const transaction = {
        date: formatDate(jsDate),
        type: row[1]?.toString()?.toUpperCase() || "",
        sellCoin: row[2]?.toString() || "",
        sellAmount: parseFloat(row[3]?.toString().replace(",", ".")) || 0,
        buyCoin: row[4]?.toString() || "",
        buyAmount: parseFloat(row[5]?.toString().replace(",", ".")) || 0,
        pricePerCoin:
          parseFloat(row[6]?.toString().replace(/[R\s,]/g, "")) || 0,
      };

      if (typeof row[5] === "string" && row[5].startsWith("=")) {
        const sellAmount = transaction.sellAmount;
        const price = transaction.pricePerCoin;
        transaction.buyAmount = price > 0 ? sellAmount / price : 0;
      }

      if (transaction.type && transaction.date) {
        transaction.sellAmount = +transaction.sellAmount.toFixed(4);
        transaction.buyAmount = +transaction.buyAmount.toFixed(8);
        transaction.pricePerCoin = +transaction.pricePerCoin.toFixed(2);

        transactions.push(transaction);
      }
    } catch (e) {
      console.warn("Skipping row:", row, e);
    }
  }

  return transactions;
};
