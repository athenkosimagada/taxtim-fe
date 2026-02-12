/**
 * Transaction List Component
 * Displays a table of all transactions
 */
import { formatZAR, formatCrypto, formatDate } from "../utils/formatters.js";

/**
 * Create the transaction list component
 * @param {Array} transactions - Array of transaction objects
 * @param {Function} onDelete - Callback when delete is clicked
 * @returns {HTMLElement} Transaction list element
 */
export function createTransactionList(transactions = [], onDelete) {
  const container = document.createElement("div");
  container.className = "card";
  container.id = "transaction-list";

  function render(txs) {
    if (txs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No transactions yet. Add your first transaction above.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">Transactions</h2>
        <span class="text-sm text-gray-500">${txs.length} total</span>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Details</th>
              <th class="text-right">ZAR Value</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${txs.map((tx) => renderRow(tx)).join("")}
          </tbody>
        </table>
      </div>
    `;

    // Attach delete handlers
    container.querySelectorAll(".delete-link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (onDelete) onDelete(id);
      });
    });
  }

  function renderRow(tx) {
    const typeClass = `badge badge-${tx.type.toLowerCase()}`;

    let details = "";
    let zarValue = 0;

    if (tx.type === "TRADE") {
      details = `${formatCrypto(tx.sourceAmount || tx.soldQuantity)} ${tx.sourceCurrency || tx.from} → ${formatCrypto(tx.destAmount || tx.quantity)} ${tx.destCurrency || tx.to}`;
      zarValue = tx.marketValueZAR || tx.proceeds || 0;
    } else {
      details = `${formatCrypto(tx.amount || tx.quantity)} ${tx.currency || tx.asset || tx.assetTo || tx.assetFrom}`;
      zarValue = tx.totalZAR || tx.quantity * tx.unitPriceZar || 0;
    }

    return `
      <tr>
        <td>${formatDate(tx.date || tx.executedAt)}</td>
        <td><span class="${typeClass}">${tx.type}</span></td>
        <td>${details}</td>
        <td class="text-right">${formatZAR(zarValue)}</td>
        <td class="text-right">
          <button class="delete-link" data-id="${tx.id}">Delete</button>
        </td>
      </tr>
    `;
  }

  /**
   * Update the transaction list
   * @param {Array} txs - New transactions array
   */
  container.update = function (txs) {
    render(txs);
  };

  render(transactions);
  return container;
}
