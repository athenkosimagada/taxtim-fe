import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseExcelPaste(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split("\t");

  return lines.slice(1).map((line) => {
    const values = line.split("\t");
    const row = {};

    headers.forEach((h, i) => {
      row[h] = values[i] || null;
    });

    row.quantity = Number(row.quantity);
    row.unitPriceZar = Number(row.unitPriceZar);
    row.assetFromMarketPriceZar = row.assetFromMarketPriceZar
      ? Number(row.assetFromMarketPriceZar)
      : null;

    return row;
  });
}

export function buildDisplayRows(result) {
  const buys = result.transactions
    .filter((t) => t.type === "BUY")
    .map((t) => ({
      type: "BUY",
      date: t.executedAt.date.slice(0, 10),
      asset: `${t.assetTo}`,
      quantity: t.quantity,
      unitPriceZar: t.unitPriceZar,
      fee: t.feeZar,
      gain: 0,
      lots: [
        {
          quantity: t.quantity,
          unitPriceZar: t.unitPriceZar,
          cost: t.quantity * t.unitPriceZar,
          date: t.executedAt.date.slice(0, 10),
        },
      ],
    }));

  const disposals = result.calculations.map((c) => ({
    type: c.type,
    date: c.date,
    asset: c.type === "TRADE" ? `${c.from} → ${c.to}` : `${c.asset}`,
    quantity: c.soldQuantity,
    fee: c.feeZar,
    gain: c.gain,
    proceeds: c.proceeds,
    cost: c.cost,
    lots: c.lots,
    taxYear: c.taxYear,
  }));

  return [...buys, ...disposals].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
}
