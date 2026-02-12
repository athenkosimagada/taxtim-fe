/**
 * TaxTim Crypto FIFO Tax Calculator
 * Main Application Entry Point
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

// API Service
import * as api from "./services/api.js";

// Application State
const state = {
  transactions: [],
  calculations: null,
  isLoading: false,
  error: null,
  activeTab: "summary",
};

// DOM Elements (will be populated on init)
let app, mainContent, transactionList, tabsContainer, tabContent, form;

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

  // Main grid layout
  const grid = document.createElement("div");
  grid.className = "main-grid";

  // Left column - Form
  const leftCol = document.createElement("div");
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
    <h2 class="section-title">Your Transactions</h2>
    <button class="btn-danger btn-sm" id="clear-all-btn" style="display: none;">
      Clear All
    </button>
  `;
  rightCol.appendChild(sectionHeader);

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

  // Attach clear all handler
  document
    .getElementById("clear-all-btn")
    .addEventListener("click", handleClearAll);

  // Load initial data
  await loadTransactions();
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
 * Note: Backend only supports deleting all transactions
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

    updateUI();
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

  // Update tabs UI
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
  // Could add loading spinner here if needed
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
