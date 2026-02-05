/**
 * Format a number as South African Rand currency
 * @param {number} value - The value to format
 * @returns {string} Formatted ZAR currency string
 */
export function formatZAR(value) {
  if (value === null || value === undefined) return "R0.00";

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a crypto amount with appropriate decimal places
 * @param {number} value - The crypto amount to format
 * @returns {string} Formatted crypto amount
 */
export function formatCrypto(value) {
  if (value === null || value === undefined) return "0";

  const absValue = Math.abs(value);
  let decimals = 2;

  if (absValue < 0.0001) {
    decimals = 8;
  } else if (absValue < 0.01) {
    decimals = 6;
  } else if (absValue < 1) {
    decimals = 4;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a date string for display
 * Handles PHP DateTime objects (with .date property) and regular date strings
 * @param {string|object} dateInput - ISO date string or PHP DateTime object
 * @returns {string} Formatted date string
 */
export function formatDate(dateInput) {
  if (!dateInput) return "";

  // Handle PHP DateTime object format: { date: "2026-02-04 00:00:00.000000", timezone_type: 3, timezone: "UTC" }
  let dateString = dateInput;
  if (typeof dateInput === "object" && dateInput.date) {
    dateString = dateInput.date;
  }

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return String(dateString);

  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * Handles PHP DateTime objects and regular date strings
 * @param {string|object} dateInput - Date string or PHP DateTime object
 * @returns {string} YYYY-MM-DD formatted date
 */
export function formatDateForInput(dateInput) {
  if (!dateInput) return "";

  // Handle PHP DateTime object format
  let dateString = dateInput;
  if (typeof dateInput === "object" && dateInput.date) {
    dateString = dateInput.date;
  }

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

/**
 * Get tax year label from year number (South African tax year: Mar - Feb)
 * @param {number} year - Tax year ending number
 * @returns {string} Tax year label like "2024/2025"
 */
export function getTaxYearLabel(year) {
  return `${year - 1}/${year}`;
}

/**
 * Calculate the South African tax year for a given date
 * Tax year runs from 1 March to end of February
 * @param {Date|string|object} dateInput - The date to check (can be PHP DateTime object)
 * @returns {number} The tax year (ending year)
 */
export function getTaxYear(dateInput) {
  if (!dateInput) return new Date().getFullYear();

  // Handle PHP DateTime object format
  let dateValue = dateInput;
  if (typeof dateInput === "object" && dateInput.date) {
    dateValue = dateInput.date;
  }

  const d = new Date(dateValue);

  // Check if date is valid
  if (isNaN(d.getTime())) return new Date().getFullYear();

  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12

  // If March or later, it's the following tax year
  return month >= 3 ? year + 1 : year;
}
