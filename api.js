/**
 * API Service for TaxTim Backend
 * Enhanced with Excel upload functionality
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

// Excel Processing Functions

/**
 * Parse Excel file on the frontend (for preview)
 * @param {File} file - Excel file (.xlsx, .xls, .csv)
 * @returns {Promise<Object>} Parsed transactions
 */
export async function parseExcelFrontend(file) {
  // Dynamically import xlsx library
  const XLSX = await import("xlsx").then(module => module.default || module);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Process the data
        const processedData = processExcelData(jsonData, file.name);
        
        resolve(processedData);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Upload Excel file to backend for processing
 * @param {File} file - Excel file
 * @returns {Promise<Object>} Response from backend
 */
export async function uploadExcelFile(file) {
  const url = `${API_BASE_URL}/upload-excel`;
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);
  formData.append("uploaded_at", new Date().toISOString());

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Upload failed with status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Excel Upload Error:", error);
    throw error;
  }
}

/**
 * Process Excel data into our transaction format
 */
function processExcelData(excelData, fileName) {
  if (!excelData || excelData.length < 2) {
    throw new Error("Excel file is empty or has no data");
  }

  // Extract headers (first row)
  const headers = excelData[0];
  
  // Validate required headers
  const requiredHeaders = ["Date", "Type", "SellCoin", "SellAmount", "BuyCoin", "BuyAmount", "BuyPricePerCoin"];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(", ")}. Please use the template.`);
  }

  // Map headers to our expected format
  const headerMap = {
    'Date': 'date',
    'Type': 'type',
    'SellCoin': 'sellCoin',
    'SellAmount': 'sellAmount',
    'BuyCoin': 'buyCoin',
    'BuyAmount': 'buyAmount',
    'BuyPricePerCoin': 'buyPricePerCoin'
  };

  // Convert data rows to transactions
  const transactions = [];
  const errors = [];
  
  for (let i = 1; i < excelData.length; i++) {
    const row = excelData[i];
    if (!row || row.length === 0) continue;

    try {
      const transaction = {};
      
      headers.forEach((header, index) => {
        const mappedKey = headerMap[header];
        if (mappedKey && row[index] !== undefined) {
          // Clean up the value
          let value = row[index];
          
          // Handle empty values
          if (value === null || value === undefined || value === '') {
            if (mappedKey.includes('Amount') || mappedKey.includes('Price')) {
              value = 0;
            } else if (mappedKey === 'date') {
              throw new Error(`Row ${i + 1}: Date is required`);
            }
          }
          
          // Handle Excel formulas (like =D2/G2)
          if (typeof value === 'string' && value.startsWith('=')) {
            value = parseExcelFormula(value, row, headers, i);
          }
          
          // Convert to appropriate type
          if (mappedKey.includes('Amount') || mappedKey.includes('Price')) {
            value = parseFloat(value);
            if (isNaN(value)) {
              throw new Error(`Row ${i + 1}: Invalid number in ${header}`);
            }
          } else if (mappedKey === 'date') {
            value = formatDate(value);
          } else if (mappedKey === 'type') {
            value = value.toUpperCase();
            if (!['BUY', 'SELL', 'TRADE'].includes(value)) {
              throw new Error(`Row ${i + 1}: Type must be BUY, SELL, or TRADE`);
            }
          }
          
          transaction[mappedKey] = value;
        }
      });

      // Validate required fields
      if (!transaction.type || !transaction.date) {
        throw new Error(`Row ${i + 1}: Type and Date are required`);
      }

      // Format the transaction for our API
      const formattedTransaction = formatTransaction(transaction);
      if (formattedTransaction) {
        transactions.push(formattedTransaction);
      }
    } catch (error) {
      errors.push({
        row: i + 1,
        error: error.message,
        data: row
      });
    }
  }

  return {
    transactions,
    metadata: {
      file: fileName,
      totalRows: excelData.length - 1,
      successfulRows: transactions.length,
      failedRows: errors.length,
      timestamp: new Date().toISOString(),
      errors
    }
  };
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateValue) {
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }
  
  if (typeof dateValue === 'string') {
    // Remove time portion if present
    return dateValue.split(' ')[0].split('T')[0];
  }
  
  if (typeof dateValue === 'number') {
    // Excel serial date number
    const date = new Date((dateValue - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  throw new Error(`Invalid date format: ${dateValue}`);
}

/**
 * Parse simple Excel formulas
 */
function parseExcelFormula(formula, row, headers, rowIndex) {
  // For now, we'll handle common formulas
  if (formula.includes('D') && formula.includes('G') && formula.includes('/')) {
    // Formula like =D2/G2
    const sellAmountIndex = headers.indexOf('SellAmount');
    const priceIndex = headers.indexOf('BuyPricePerCoin');
    
    if (sellAmountIndex !== -1 && priceIndex !== -1) {
      const sellAmount = parseFloat(row[sellAmountIndex]) || 0;
      const price = parseFloat(row[priceIndex]) || 1;
      if (price === 0) return 0;
      return sellAmount / price;
    }
  }
  
  // Return 0 for unknown formulas
  console.warn(`Could not parse formula: ${formula} at row ${rowIndex + 1}`);
  return 0;
}

/**
 * Format transaction for frontend display
 */
function formatTransaction(transaction) {
  const { type, sellCoin, sellAmount, buyCoin, buyAmount, buyPricePerCoin, date } = transaction;
  
  const baseTx = {
    date: date,
    type: type.toUpperCase(),
    feeZar: 0,
  };

  switch (type.toUpperCase()) {
    case 'BUY':
      return {
        ...baseTx,
        currency: buyCoin,
        amount: buyAmount,
        totalZAR: sellAmount
      };

    case 'SELL':
      return {
        ...baseTx,
        currency: sellCoin,
        amount: sellAmount,
        totalZAR: buyAmount
      };

    case 'TRADE':
      return {
        ...baseTx,
        sourceCurrency: sellCoin,
        destCurrency: buyCoin,
        destAmount: buyAmount,
        sourceAmount: sellAmount,
        marketValueZAR: buyAmount * buyPricePerCoin
      };

    default:
      return null;
  }
}

// Original API functions (keep these)
export async function fetchTransactions() {
  return apiRequest("/transactions");
}

export async function importTransactions(transactions) {
  // Convert frontend format to backend format
  const backendTransactions = transactions.map(tx => convertToBackendFormat(tx));
  
  return apiRequest("/transactions/import", {
    method: "POST",
    body: JSON.stringify(backendTransactions),
  });
}

export async function addTransaction(transaction) {
  const backendTx = convertToBackendFormat(transaction);

  return apiRequest("/transactions/import", {
    method: "POST",
    body: JSON.stringify([backendTx]),
  });
}

export async function deleteAllTransactions() {
  return apiRequest("/transactions", {
    method: "DELETE",
  });
}

export async function getCalculations() {
  return apiRequest("/transactions/calculate");
}

export async function getTaxYearReport(year) {
  return apiRequest(`/reports/tax-year/${year}`);
}

// Format conversion functions
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