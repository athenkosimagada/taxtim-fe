/**
 * TaxTim Crypto FIFO Tax Calculator
 * Main Application Entry Point
 * Enhanced with Excel Upload functionality
 */
import "./style.css";

// Components
import { createHeader } from "./components/Header.js";
import { createTransactionForm } from "./components/TransactionForm.js";
import { createTransactionList } from "./components/TransactionList.js";
import { createTaxSummary } from "./components/TaxSummary.js";
import { createTaxEventDetails } from "./components/TaxEventDetails.js";
import { createLotDetails } from "./components/LotDetails.js";
import { createFooter } from "./components/Footer.js";
import { showAlert } from "./components/Alert.js";
import { createTabs } from "./components/Tabs.js";
import { createExcelUpload } from "./components/ExcelUpload.js"; // New component

// API Service
import * as api from "./services/api.js";

// Application State
const state = {
  transactions: [],
  calculations: null,
  isLoading: false,
  error: null,
  activeTab: "summary",
  excelPreview: null, // New state for Excel preview
};

// DOM Elements
let app, mainContent, transactionList, tabsContainer, tabContent, form, excelUploadSection;

/**
 * Initialize the application
 */
async function init() {
  app = document.querySelector("#app");
  app.innerHTML = "";

  // Create layout
  app.appendChild(createHeader());

  const main = document.createElement("main");
  main.className = "main-content";

  const container = document.createElement("div");
  container.className = "container";

  mainContent = document.createElement("div");
  mainContent.id = "main-content";

  // Alert container
  const alertContainer = document.createElement("div");
  alertContainer.id = "alert-container";
  mainContent.appendChild(alertContainer);

  // Excel Upload Section (NEW)
  excelUploadSection = document.createElement("div");
  excelUploadSection.id = "excel-upload-section";
  excelUploadSection.className = "mb-8";
  mainContent.appendChild(excelUploadSection);

  // Main grid layout
  const grid = document.createElement("div");
  grid.className = "main-grid";

  // Left column - Form & Excel Upload
  const leftCol = document.createElement("div");
  leftCol.className = "space-y-6"; // Add spacing between sections
  
  // Excel upload component (NEW)
  const excelUpload = createExcelUpload({
    onFileSelect: handleExcelFileSelect,
    onProcess: handleExcelProcess,
    onImport: handleExcelImport,
    onClearPreview: clearExcelPreview,
    onDownloadTemplate: downloadTemplate,
  });
  leftCol.appendChild(excelUpload);

  // Transaction Form
  form = createTransactionForm(handleAddTransaction);
  leftCol.appendChild(form);

  // Right column - Results
  const rightCol = document.createElement("div");
  rightCol.className = "space-y-6";
  rightCol.id = "right-column";

  // Section header with clear button
  const sectionHeader = document.createElement("div");
  sectionHeader.className = "section-header";
  sectionHeader.innerHTML = `
    <div class="flex items-center justify-between">
      <h2 class="section-title">Your Transactions</h2>
      <div class="flex gap-2">
        <button class="btn-secondary btn-sm" id="view-excel-preview-btn" style="display: none;">
          Excel Preview
        </button>
        <button class="btn-danger btn-sm" id="clear-all-btn" style="display: none;">
          Clear All
        </button>
      </div>
    </div>
  `;
  rightCol.appendChild(sectionHeader);

  // Excel Preview Modal (NEW)
  const previewModal = document.createElement("div");
  previewModal.id = "excel-preview-modal";
  previewModal.className = "modal hidden";
  previewModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Excel Import Preview</h3>
        <button class="modal-close" id="close-preview-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div id="excel-preview-errors" class="mb-4 hidden"></div>
        <div id="excel-preview-content" class="max-h-96 overflow-auto"></div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="cancel-excel-import">Cancel</button>
        <button class="btn-primary" id="confirm-excel-import">Import All</button>
      </div>
    </div>
  `;
  document.body.appendChild(previewModal);

  // Transaction list
  transactionList = createTransactionList([], handleDeleteTransaction);
  rightCol.appendChild(transactionList);

  // Tabs for tax results
  tabsContainer = document.createElement("div");
  tabsContainer.id = "tabs-container";
  tabsContainer.style.display = "none";

  const tabs = createTabs(
    [
      { id: "summary", label: "Summary" },
      { id: "events", label: "Tax Events" },
      { id: "lots", label: "FIFO Lots" },
    ],
    state.activeTab,
    handleTabChange,
  );
  tabsContainer.appendChild(tabs);

  tabContent = document.createElement("div");
  tabContent.id = "tab-content";
  tabsContainer.appendChild(tabContent);

  rightCol.appendChild(tabsContainer);

  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  mainContent.appendChild(grid);
  container.appendChild(mainContent);
  main.appendChild(container);
  app.appendChild(main);
  app.appendChild(createFooter());

  // Attach event handlers
  document.getElementById("clear-all-btn").addEventListener("click", handleClearAll);
  document.getElementById("view-excel-preview-btn").addEventListener("click", showExcelPreview);
  document.getElementById("close-preview-modal").addEventListener("click", hideExcelPreview);
  document.getElementById("cancel-excel-import").addEventListener("click", hideExcelPreview);
  document.getElementById("confirm-excel-import").addEventListener("click", confirmExcelImport);

  // Close modal on outside click
  previewModal.addEventListener("click", (e) => {
    if (e.target === previewModal) {
      hideExcelPreview();
    }
  });

  // Load initial data
  await loadTransactions();
  
  // Initialize Excel upload section
  updateExcelUploadUI();
}

/**
 * Handle Excel file selection
 */
function handleExcelFileSelect(file) {
  // Update UI to show file selected
  const dropZone = document.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.innerHTML = `
      <div class="text-center p-4">
        <div class="text-2xl mb-2">📄</div>
        <p class="font-medium text-blue-600">${file.name}</p>
        <p class="text-sm text-gray-500 mt-1">Ready to process</p>
      </div>
    `;
  }
}

/**
 * Handle Excel processing (frontend parsing)
 */
async function handleExcelProcess(file) {
  try {
    setLoading(true);
    
    const data = await api.parseExcelFrontend(file);
    state.excelPreview = data;
    
    // Show preview modal
    showExcelPreview();
    
    showSuccess(`Successfully parsed ${data.transactions.length} transactions`);
  } catch (err) {
    showError(err.message || "Failed to process Excel file");
    state.excelPreview = null;
  } finally {
    setLoading(false);
  }
}

/**
 * Handle Excel import to backend
 */
async function handleExcelImport(transactions) {
  if (!transactions || transactions.length === 0) return;
  
  try {
    setLoading(true);
    
    await api.importTransactions(transactions);
    
    // Reload all data
    await loadTransactions();
    
    // Clear preview
    clearExcelPreview();
    
    showSuccess(`Successfully imported ${transactions.length} transactions`);
  } catch (err) {
    showError(err.message || "Failed to import transactions");
  } finally {
    setLoading(false);
  }
}

/**
 * Show Excel preview modal
 */
function showExcelPreview() {
  if (!state.excelPreview) return;
  
  const modal = document.getElementById("excel-preview-modal");
  const errorsContainer = document.getElementById("excel-preview-errors");
  const contentContainer = document.getElementById("excel-preview-content");
  
  // Show errors if any
  if (state.excelPreview.metadata.errors && state.excelPreview.metadata.errors.length > 0) {
    errorsContainer.classList.remove("hidden");
    errorsContainer.innerHTML = `
      <div class="alert alert-warning">
        <h4 class="font-semibold mb-1">⚠️ ${state.excelPreview.metadata.errors.length} Issues Found:</h4>
        <ul class="text-sm space-y-1">
          ${state.excelPreview.metadata.errors.slice(0, 5).map(error => `
            <li>• Row ${error.row}: ${error.error}</li>
          `).join('')}
          ${state.excelPreview.metadata.errors.length > 5 ? 
            `<li>... and ${state.excelPreview.metadata.errors.length - 5} more</li>` : ''}
        </ul>
      </div>
    `;
  } else {
    errorsContainer.classList.add("hidden");
  }
  
  // Show transaction preview
  const html = `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${state.excelPreview.transactions.slice(0, 20).map((tx, index) => `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
              <td class="px-4 py-2 text-sm">${tx.date}</td>
              <td class="px-4 py-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tx.type === 'BUY' ? 'bg-green-100 text-green-800' :
                  tx.type === 'SELL' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }">
                  ${tx.type}
                </span>
              </td>
              <td class="px-4 py-2 text-sm">
                ${getTransactionPreviewText(tx)}
              </td>
              <td class="px-4 py-2 text-sm font-medium">
                R ${tx.type === 'TRADE' ? (tx.marketValueZAR || 0).toFixed(2) : (tx.totalZAR || 0).toFixed(2)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${state.excelPreview.transactions.length > 20 ? 
        `<p class="text-sm text-gray-500 mt-2 text-center">... showing 20 of ${state.excelPreview.transactions.length} transactions</p>` : ''}
    </div>
  `;
  
  contentContainer.innerHTML = html;
  modal.classList.remove("hidden");
}

/**
 * Hide Excel preview modal
 */
function hideExcelPreview() {
  const modal = document.getElementById("excel-preview-modal");
  modal.classList.add("hidden");
}

/**
 * Confirm and import Excel transactions
 */
async function confirmExcelImport() {
  if (!state.excelPreview) return;
  
  await handleExcelImport(state.excelPreview.transactions);
  hideExcelPreview();
}

/**
 * Clear Excel preview data
 */
function clearExcelPreview() {
  state.excelPreview = null;
  
  // Reset Excel upload UI
  updateExcelUploadUI();
}

/**
 * Download Excel template
 */
function downloadTemplate() {
  const templateData = `Date,Type,SellCoin,SellAmount,BuyCoin,BuyAmount,BuyPricePerCoin
2023-05-03,BUY,ZAR,10000,BTC,0.1,100000
2023-05-10,BUY,ZAR,20000,BTC,0.13333,150000
2024-03-11,SELL,BTC,0.1,ZAR,25000,250000
2024-04-02,TRADE,BTC,0.1,USDT,1666.67,18`;
  
  const blob = new Blob([templateData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'crypto-transactions-template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  showSuccess("Template downloaded successfully");
}

/**
 * Get preview text for a transaction
 */
function getTransactionPreviewText(tx) {
  if (tx.type === 'BUY') {
    return `Buy ${tx.amount || 0} ${tx.currency || ''}`;
  } else if (tx.type === 'SELL') {
    return `Sell ${tx.amount || 0} ${tx.currency || ''}`;
  } else if (tx.type === 'TRADE') {
    return `${tx.sourceAmount || 0} ${tx.sourceCurrency || ''} → ${tx.destAmount || 0} ${tx.destCurrency || ''}`;
  }
  return '';
}

/**
 * Update Excel upload section UI
 */
function updateExcelUploadUI() {
  const viewExcelBtn = document.getElementById("view-excel-preview-btn");
  if (viewExcelBtn) {
    viewExcelBtn.style.display = state.excelPreview ? "inline-flex" : "none";
  }
}

/**
 * Load transactions from the backend
 */
async function loadTransactions() {
  try {
    setLoading(true);
    const txs = await api.fetchTransactions();
    state.transactions = txs || [];

    if (state.transactions.length > 0) {
      await recalculate();
    }

    updateUI();
  } catch (err) {
    showError(err.message || "Failed to load transactions");
  } finally {
    setLoading(false);
  }
}

/**
 * Recalculate FIFO from backend
 */
async function recalculate() {
  if (state.transactions.length === 0) {
    state.calculations = null;
    return;
  }

  try {
    const result = await api.getCalculations();
    state.calculations = result;
  } catch (err) {
    showError(err.message || "Failed to calculate FIFO");
    state.calculations = null;
  }
}

/**
 * Handle adding a new transaction
 */
async function handleAddTransaction(transaction) {
  try {
    setLoading(true);
    form.setLoading(true);

    await api.addTransaction(transaction);

    // Reload all data
    const txs = await api.fetchTransactions();
    state.transactions = txs || [];

    await recalculate();
    updateUI();

    showSuccess("Transaction added successfully");
  } catch (err) {
    showError(err.message || "Failed to add transaction");
  } finally {
    setLoading(false);
    form.setLoading(false);
  }
}

/**
 * Handle deleting a transaction
 */
async function handleDeleteTransaction(id) {
  showError(
    'Individual delete not supported. Use "Clear All" to remove all transactions.',
  );
}

/**
 * Handle clearing all transactions
 */
async function handleClearAll() {
  if (!confirm("Are you sure you want to delete all transactions?")) {
    return;
  }

  try {
    setLoading(true);
    await api.deleteAllTransactions();

    state.transactions = [];
    state.calculations = null;
    state.excelPreview = null;

    updateUI();
    updateExcelUploadUI();
    showSuccess("All transactions deleted");
  } catch (err) {
    showError(err.message || "Failed to delete transactions");
  } finally {
    setLoading(false);
  }
}

/**
 * Handle tab change
 */
function handleTabChange(tabId) {
  state.activeTab = tabId;
  updateTabContent();

  const tabs = document.querySelector("#tabs-container > .tabs");
  if (tabs) {
    tabs.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabId);
    });
  }
}

/**
 * Update the entire UI based on state
 */
function updateUI() {
  // Update transaction list
  transactionList.update(state.transactions);

  // Show/hide clear button
  const clearBtn = document.getElementById("clear-all-btn");
  if (clearBtn) {
    clearBtn.style.display =
      state.transactions.length > 0 ? "inline-flex" : "none";
  }

  // Show/hide tabs based on calculations
  if (tabsContainer) {
    tabsContainer.style.display =
      state.calculations &&
      state.calculations.calculations &&
      state.calculations.calculations.length > 0
        ? "block"
        : "none";
  }

  // Update tab content
  updateTabContent();
  
  // Update Excel upload UI
  updateExcelUploadUI();
}

/**
 * Update just the tab content
 */
function updateTabContent() {
  if (!tabContent) return;

  tabContent.innerHTML = "";

  if (!state.calculations) return;

  let component;
  switch (state.activeTab) {
    case "summary":
      component = createTaxSummary(state.calculations);
      break;
    case "events":
      component = createTaxEventDetails(state.calculations);
      break;
    case "lots":
      component = createLotDetails(state.calculations);
      break;
  }

  if (component) {
    tabContent.appendChild(component);
  }
}

/**
 * Set loading state
 */
function setLoading(loading) {
  state.isLoading = loading;
  
  // Disable/enable buttons during loading
  const buttons = document.querySelectorAll('button:not([data-ignore-loading])');
  buttons.forEach(btn => {
    if (loading) {
      btn.setAttribute('disabled', 'true');
    } else {
      btn.removeAttribute('disabled');
    }
  });
}

/**
 * Show error message
 */
function showError(message) {
  state.error = message;
  const alertContainer = document.getElementById("alert-container");
  if (alertContainer) {
    showAlert(alertContainer, message, "error");
  }
}

/**
 * Show success message
 */
function showSuccess(message) {
  const alertContainer = document.getElementById("alert-container");
  if (alertContainer) {
    showAlert(alertContainer, message, "success");
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", init);

// Also try to init immediately if DOM is already loaded
if (document.readyState !== "loading") {
  init();
}