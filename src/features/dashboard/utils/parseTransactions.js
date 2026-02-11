export function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return Number(priceStr.replace(/[^0-9.-]+/g, ""));
}

export function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  return Number(value.toString().replace(/,/g, ""));
}

export function normalizeDate(dateStr) {
  return dateStr.split(" ")[0];
}

export function parseTransactionsFromText(text) {
  const lines = text.trim().split("\n");

  const [, ...rows] = lines;

  return rows.map((row) => {
    const columns = row.split("\t");

    const [
      date,
      type,
      sellCoin,
      sellAmount,
      buyCoin,
      buyAmount,
      buyPricePerCoin,
    ] = columns;

    return {
      date: normalizeDate(date),
      type: type.trim(),
      sellCoin: sellCoin.trim(),
      sellAmount: parseNumber(sellAmount),
      buyCoin: buyCoin.trim(),
      buyAmount: parseNumber(buyAmount),
      pricePerCoin: parsePrice(buyPricePerCoin),
    };
  });
}
