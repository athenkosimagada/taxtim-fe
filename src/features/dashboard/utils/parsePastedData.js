import { parseExcelData } from "./parseExcel";

export const parsePastedData = (text) => {
  if (!text) return [];

  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split("\t").map((cell) => cell.trim()));

  return parseExcelData(rows);
};
