/**
 * Transaction Form Component
 * Form for adding BUY, SELL, and TRADE transactions
 */

const COMMON_CRYPTOS = [
  "BTC",
  "ETH",
  "XRP",
  "SOL",
  "ADA",
  "DOGE",
  "SHIB",
  "LINK",
];

/**
 * Create the transaction form
 * @param {Function} onSubmit - Callback when form is submitted
 * @returns {HTMLElement} Form element
 */
export function createTransactionForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "card";
  form.id = "transaction-form";

  let currentType = "BUY";
  let formData = {
    date: "",
    currency: "",
    amount: "",
    totalZAR: "",
    sourceCurrency: "",
    sourceAmount: "",
    destCurrency: "",
    destAmount: "",
    marketValueZAR: "",
  };

  function render() {
    form.innerHTML = `
      <h2 class="card-title">Add Transaction</h2>
      
      <!-- Transaction Type Selector -->
      <div class="type-selector">
        ${["BUY", "SELL", "TRADE"]
          .map(
            (type) => `
          <button type="button" class="type-btn ${currentType === type ? "active" : ""}" data-type="${type}">
            ${type}
          </button>
        `,
          )
          .join("")}
      </div>
      
      <!-- Date Field -->
      <div class="input-group">
        <label for="date">Date</label>
        <input type="date" id="date" name="date" value="${formData.date}" required>
        <span class="error-message" id="date-error"></span>
      </div>
      
      ${currentType === "BUY" || currentType === "SELL" ? renderBuySellFields() : renderTradeFields()}
      
      <button type="submit" class="btn-primary btn-full mt-4" id="submit-btn">
        Add ${currentType} Transaction
      </button>
    `;

    attachEventListeners();
  }

  function renderBuySellFields() {
    return `
      <!-- Cryptocurrency -->
      <div class="input-group">
        <label for="currency">Cryptocurrency</label>
        <div class="crypto-quick-select">
          ${COMMON_CRYPTOS.map(
            (crypto) => `
            <button type="button" class="crypto-btn ${formData.currency === crypto ? "active" : ""}" data-crypto="${crypto}">
              ${crypto}
            </button>
          `,
          ).join("")}
        </div>
        <input type="text" id="currency" name="currency" value="${formData.currency}" 
          placeholder="Or enter custom (e.g., AVAX)" required>
        <span class="error-message" id="currency-error"></span>
      </div>
      
      <div class="grid-2">
        <!-- Amount -->
        <div class="input-group">
          <label for="amount">Amount</label>
          <input type="number" id="amount" name="amount" value="${formData.amount}" 
            placeholder="0.00" step="any" min="0" required>
          <span class="error-message" id="amount-error"></span>
        </div>
        
        <!-- Total ZAR -->
        <div class="input-group">
          <label for="totalZAR">Total (ZAR)</label>
          <input type="number" id="totalZAR" name="totalZAR" value="${formData.totalZAR}" 
            placeholder="0.00" step="any" min="0" required>
          <span class="error-message" id="totalZAR-error"></span>
        </div>
      </div>
    `;
  }

  function renderTradeFields() {
    return `
      <div class="grid-2">
        <!-- From Currency -->
        <div class="input-group">
          <label for="sourceCurrency">From Currency</label>
          <input type="text" id="sourceCurrency" name="sourceCurrency" value="${formData.sourceCurrency}" 
            placeholder="e.g., BTC" required>
          <span class="error-message" id="sourceCurrency-error"></span>
        </div>
        
        <!-- Source Amount -->
        <div class="input-group">
          <label for="sourceAmount">Amount</label>
          <input type="number" id="sourceAmount" name="sourceAmount" value="${formData.sourceAmount}" 
            placeholder="0.00" step="any" min="0" required>
          <span class="error-message" id="sourceAmount-error"></span>
        </div>
      </div>
      
      <div class="grid-2">
        <!-- To Currency -->
        <div class="input-group">
          <label for="destCurrency">To Currency</label>
          <input type="text" id="destCurrency" name="destCurrency" value="${formData.destCurrency}" 
            placeholder="e.g., ETH" required>
          <span class="error-message" id="destCurrency-error"></span>
        </div>
        
        <!-- Dest Amount -->
        <div class="input-group">
          <label for="destAmount">Amount</label>
          <input type="number" id="destAmount" name="destAmount" value="${formData.destAmount}" 
            placeholder="0.00" step="any" min="0" required>
          <span class="error-message" id="destAmount-error"></span>
        </div>
      </div>
      
      <!-- Market Value ZAR -->
      <div class="input-group">
        <label for="marketValueZAR">Market Value (ZAR)</label>
        <p class="hint">The ZAR value of the source crypto at the time of trade</p>
        <input type="number" id="marketValueZAR" name="marketValueZAR" value="${formData.marketValueZAR}" 
          placeholder="0.00" step="any" min="0" required>
        <span class="error-message" id="marketValueZAR-error"></span>
      </div>
    `;
  }

  function attachEventListeners() {
    // Type selector buttons
    form.querySelectorAll(".type-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        currentType = e.target.dataset.type;
        render();
      });
    });

    // Crypto quick select buttons
    form.querySelectorAll(".crypto-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        formData.currency = e.target.dataset.crypto;
        const currencyInput = form.querySelector("#currency");
        if (currencyInput) currencyInput.value = formData.currency;
        render();
      });
    });

    // Input change handlers
    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => {
        formData[e.target.name] = e.target.value;
        // Clear error on input
        const errorEl = form.querySelector(`#${e.target.name}-error`);
        if (errorEl) errorEl.textContent = "";
      });
    });

    // Form submission
    form.addEventListener("submit", handleSubmit);
  }

  function validate() {
    let isValid = true;
    const errors = {};

    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    }

    if (currentType === "BUY" || currentType === "SELL") {
      if (!formData.currency) {
        errors.currency = "Currency is required";
        isValid = false;
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        errors.amount = "Valid amount is required";
        isValid = false;
      }
      if (!formData.totalZAR || parseFloat(formData.totalZAR) <= 0) {
        errors.totalZAR = "Valid ZAR amount is required";
        isValid = false;
      }
    } else if (currentType === "TRADE") {
      if (!formData.sourceCurrency) {
        errors.sourceCurrency = "Source currency is required";
        isValid = false;
      }
      if (!formData.sourceAmount || parseFloat(formData.sourceAmount) <= 0) {
        errors.sourceAmount = "Valid source amount is required";
        isValid = false;
      }
      if (!formData.destCurrency) {
        errors.destCurrency = "Destination currency is required";
        isValid = false;
      }
      if (!formData.destAmount || parseFloat(formData.destAmount) <= 0) {
        errors.destAmount = "Valid destination amount is required";
        isValid = false;
      }
      if (
        !formData.marketValueZAR ||
        parseFloat(formData.marketValueZAR) <= 0
      ) {
        errors.marketValueZAR = "Valid market value is required";
        isValid = false;
      }
      if (
        formData.sourceCurrency &&
        formData.destCurrency &&
        formData.sourceCurrency.toUpperCase() ===
          formData.destCurrency.toUpperCase()
      ) {
        errors.destCurrency = "Cannot trade same currency";
        isValid = false;
      }
    }

    // Display errors
    Object.keys(errors).forEach((field) => {
      const errorEl = form.querySelector(`#${field}-error`);
      if (errorEl) errorEl.textContent = errors[field];
    });

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    let transaction;
    if (currentType === "BUY" || currentType === "SELL") {
      transaction = {
        type: currentType,
        date: formData.date,
        currency: formData.currency.toUpperCase(),
        amount: parseFloat(formData.amount),
        totalZAR: parseFloat(formData.totalZAR),
      };
    } else {
      transaction = {
        type: "TRADE",
        date: formData.date,
        sourceCurrency: formData.sourceCurrency.toUpperCase(),
        sourceAmount: parseFloat(formData.sourceAmount),
        destCurrency: formData.destCurrency.toUpperCase(),
        destAmount: parseFloat(formData.destAmount),
        marketValueZAR: parseFloat(formData.marketValueZAR),
      };
    }

    onSubmit(transaction);

    // Reset form
    formData = {
      date: "",
      currency: "",
      amount: "",
      totalZAR: "",
      sourceCurrency: "",
      sourceAmount: "",
      destCurrency: "",
      destAmount: "",
      marketValueZAR: "",
    };
    render();
  }

  /**
   * Set loading state
   * @param {boolean} loading
   */
  form.setLoading = function (loading) {
    const btn = form.querySelector("#submit-btn");
    if (btn) {
      btn.disabled = loading;
      btn.textContent = loading
        ? "Adding..."
        : `Add ${currentType} Transaction`;
    }
  };

  render();
  return form;
}
