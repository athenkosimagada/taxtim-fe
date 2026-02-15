export const formatCurrency = (value) =>
  "R" + Number(value || 0).toLocaleString();

export const formatDateZA = (date) =>
  new Date(date).toLocaleDateString("en-ZA");
