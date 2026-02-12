/**
 * Lot Details Component
 * Shows current FIFO lots (holdings) for each cryptocurrency
 */
import { formatZAR, formatCrypto, formatDate } from "../utils/formatters.js";

/**
 * Create the lot details component
 * @param {Object} calculations - FIFO calculation results from backend
 * @returns {HTMLElement} Lot details element
 */
export function createLotDetails(calculations) {
  const container = document.createElement("div");
  container.className = "card";
  container.id = "lot-details";

  function render(data) {
    if (!data || !data.balances || Object.keys(data.balances).length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No remaining lots. Add BUY or TRADE transactions to build your portfolio.</p>
        </div>
      `;
      return;
    }

    const { balances } = data;

    // Filter out empty balances
    const currencies = Object.entries(balances).filter(
      ([_, lots]) =>
        lots && lots.length > 0 && lots.some((lot) => lot.quantity > 0),
    );

    if (currencies.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No remaining lots. All crypto has been disposed.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <h2 class="card-title">Current Lots (FIFO Queue)</h2>
      <p class="text-sm text-gray-500 mb-6">
        These are your remaining crypto holdings broken down by acquisition lot. 
        Oldest lots will be used first when you sell or trade.
      </p>
      
      <div class="space-y-6">
        ${currencies.map(([currency, lots]) => renderCurrencySection(currency, lots)).join("")}
      </div>
    `;
  }

  function renderCurrencySection(currency, lots) {
    const activeLots = lots.filter((lot) => lot.quantity > 0);
    const totalRemaining = activeLots.reduce(
      (sum, lot) => sum + lot.quantity,
      0,
    );
    const totalCost = activeLots.reduce(
      (sum, lot) => sum + lot.quantity * lot.unitPriceZar,
      0,
    );

    return `
      <div class="lot-section">
        <div class="lot-header">
          <h3 class="lot-currency">${currency}</h3>
          <div class="lot-summary">
            Total: ${formatCrypto(totalRemaining)} | Base Cost: ${formatZAR(totalCost)}
          </div>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Acquired</th>
                <th class="text-right">Remaining</th>
                <th class="text-right">Cost/Unit</th>
                <th class="text-right">Base Cost</th>
              </tr>
            </thead>
            <tbody>
              ${activeLots
                .map(
                  (lot) => `
                <tr>
                  <td>${formatDate(lot.date)}</td>
                  <td class="text-right font-medium">${formatCrypto(lot.quantity)}</td>
                  <td class="text-right">${formatZAR(lot.unitPriceZar)}</td>
                  <td class="text-right">${formatZAR(lot.quantity * lot.unitPriceZar)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /**
   * Update the component with new data
   * @param {Object} data - New calculation data
   */
  container.update = function (data) {
    render(data);
  };

  render(calculations);
  return container;
}
