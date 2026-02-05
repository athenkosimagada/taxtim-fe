/**
 * API Service for TaxTim Backend
 * Connects to the PHP backend at taxtim-be
 */

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Fetch all transactions from the backend
 * @returns {Promise<Array>} Array of transaction objects
 */
export async function fetchTransactions() {
  return apiRequest("/transactions");
}

/**
 * Import transactions to the backend
 * @param {Array} transactions - Array of transaction objects to import
 * @returns {Promise<Object>} Response with success status
 */
export async function importTransactions(transactions) {
  return apiRequest("/transactions/import", {
    method: "POST",
    body: JSON.stringify(transactions),
  });
}

/**
 * Add a single transaction
 * Converts frontend format to backend format and imports
 * @param {Object} transaction - Transaction object from the form
 * @returns {Promise<Object>} Response with success status
 */
export async function addTransaction(transaction) {
  // Convert frontend transaction format to backend format
  const backendTx = convertToBackendFormat(transaction);

  return apiRequest("/transactions/import", {
    method: "POST",
    body: JSON.stringify([backendTx]),
  });
}

/**
 * Delete all transactions
 * @returns {Promise<Object>} Response with success status
 */
export async function deleteAllTransactions() {
  return apiRequest("/transactions", {
    method: "DELETE",
  });
}

/**
 * Get FIFO calculations for all transactions
 * @returns {Promise<Object>} Calculation results including gains, lots, etc.
 */
export async function getCalculations() {
  return apiRequest("/transactions/calculate");
}

/**
 * Get tax year report
 * @param {number} year - Tax year to get report for
 * @returns {Promise<Object>} Tax year report data
 */
export async function getTaxYearReport(year) {
  return apiRequest(`/reports/tax-year/${year}`);
}

/**
 * Convert frontend transaction format to backend format
 * @param {Object} tx - Frontend transaction object
 * @returns {Object} Backend-compatible transaction object
 */
function convertToBackendFormat(tx) {
  const base = {
    wallet: "default",
    type: tx.type,
    executedAt: tx.date,
    feeZar: tx.feeZar || 0,
  };

  if (tx.type === "BUY") {
    return {
      ...base,
      assetTo: tx.currency,
      assetFrom: null,
      quantity: tx.amount,
      unitPriceZar: tx.totalZAR / tx.amount,
    };
  }

  if (tx.type === "SELL") {
    return {
      ...base,
      assetFrom: tx.currency,
      assetTo: null,
      quantity: tx.amount,
      unitPriceZar: tx.totalZAR / tx.amount,
    };
  }

  if (tx.type === "TRADE") {
    return {
      ...base,
      assetFrom: tx.sourceCurrency,
      assetTo: tx.destCurrency,
      quantity: tx.destAmount,
      unitPriceZar: tx.marketValueZAR / tx.destAmount,
      assetFromMarketPriceZar: tx.marketValueZAR / tx.sourceAmount,
    };
  }

  return base;
}

/**
 * Convert backend transaction to frontend display format
 * @param {Object} tx - Backend transaction object
 * @returns {Object} Frontend-compatible transaction object
 */
export function convertToFrontendFormat(tx) {
  const base = {
    id: tx.id,
    type: tx.type,
    date: tx.executedAt?.date?.split(" ")[0] || tx.executedAt,
    wallet: tx.wallet,
    feeZar: tx.feeZar,
  };

  if (tx.type === "BUY") {
    return {
      ...base,
      currency: tx.assetTo,
      amount: tx.quantity,
      totalZAR: tx.quantity * tx.unitPriceZar,
    };
  }

  if (tx.type === "SELL") {
    return {
      ...base,
      currency: tx.assetFrom,
      amount: tx.quantity,
      totalZAR: tx.quantity * tx.unitPriceZar,
    };
  }

  if (tx.type === "TRADE") {
    return {
      ...base,
      sourceCurrency: tx.assetFrom,
      destCurrency: tx.assetTo,
      destAmount: tx.quantity,
      sourceAmount: tx.assetFromMarketPriceZar
        ? (tx.quantity * tx.unitPriceZar) / tx.assetFromMarketPriceZar
        : 0,
      marketValueZAR: tx.quantity * tx.unitPriceZar,
    };
  }

  return base;
}
