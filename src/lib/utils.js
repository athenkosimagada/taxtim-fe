import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseExcelPaste(text) {
  const lines = text.trim().split("\n");
  const headers = lines.shift().split("\t");

  return lines.map((line) => {
    const values = line.split("\t");
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = values[i]?.trim();
    });

    return {
      wallet: "default",
      type: row.type,
      assetFrom: row.assetFrom || null,
      assetTo: row.assetTo || null,
      quantity: Number(row.quantity),
      unitPriceZar: Number(row.unitPriceZar),
      feeZar: Number(row.feeZar || 0),
      assetFromMarketPriceZar: row.assetFromMarketPriceZar
        ? Number(row.assetFromMarketPriceZar)
        : null,
      executedAt: row.executedAt,
    };
  });
}

export function money(v) {
  return `R${Number(v).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatTransactionRow(tx) {
  switch (tx.type) {
    case "BUY":
      return {
        asset: tx.assetTo,
        quantity: tx.quantity,
        subtitle: "Purchase",
        unitPrice: money(tx.unitPriceZar),
        fee: money(tx.feeZar),
        marketPrice: tx.assetFromMarketPriceZar
          ? money(tx.assetFromMarketPriceZar)
          : null,
      };

    case "SELL":
      return {
        asset: tx.assetFrom,
        quantity: tx.quantity,
        subtitle: "Disposal",
        unitPrice: money(tx.unitPriceZar),
        fee: money(tx.feeZar),
        marketPrice: tx.assetFromMarketPriceZar
          ? money(tx.assetFromMarketPriceZar)
          : null,
      };

    case "TRADE":
      return {
        asset: `${tx.assetFrom} → ${tx.assetTo}`,
        quantity: tx.quantity,
        subtitle: "Crypto-to-crypto trade",
        unitPrice: money(tx.unitPriceZar),
        fee: money(tx.feeZar),
        marketPrice: tx.assetFromMarketPriceZar
          ? money(tx.assetFromMarketPriceZar)
          : null,
      };

    default:
      return {
        asset: "-",
        quantity: "-",
        subtitle: "",
        unitPrice: "-",
        fee: "-",
        marketPrice: "-",
      };
  }
}
