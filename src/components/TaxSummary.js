/**
 * Tax Summary Component
 * Displays overall tax calculations summary
 */
import {
  formatZAR,
  formatCrypto,
  getTaxYearLabel,
} from "../utils/formatters.js";

/**
 * Create the tax summary component
 * @param {Object} calculations - FIFO calculation results from backend
 * @returns {HTMLElement} Tax summary element
 */
export function createTaxSummary(calculations) {
  const container = document.createElement("div");
  container.className = "space-y-6";
  container.id = "tax-summary";

  function render(data) {
    if (!data || !data.calculations || data.calculations.length === 0) {
      container.innerHTML = `
        <div class="card empty-state">
          <p>No tax calculations yet. Add SELL or TRADE transactions to see tax summary.</p>
        </div>
      `;
      return;
    }

    const { calculations: calcs, capitalGains, baseCosts } = data;

    // Calculate totals
    const totalProceeds = calcs.reduce((sum, c) => sum + (c.proceeds || 0), 0);
    const totalCost = calcs.reduce((sum, c) => sum + (c.cost || 0), 0);
    const totalGain = calcs.reduce((sum, c) => sum + (c.gain || 0), 0);
    const eventCount = calcs.length;

    container.innerHTML = `
      <!-- Overall Totals -->
      <div class="card">
        <h2 class="card-title">Tax Summary</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">Total Proceeds</p>
            <p class="stat-value">${formatZAR(totalProceeds)}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Total Cost (FIFO)</p>
            <p class="stat-value">${formatZAR(totalCost)}</p>
          </div>
          <div class="stat-card ${totalGain >= 0 ? "gain" : "loss"}">
            <p class="stat-label">Total ${totalGain >= 0 ? "Gain" : "Loss"}</p>
            <p class="stat-value ${totalGain >= 0 ? "gain" : "loss"}">${formatZAR(Math.abs(totalGain))}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Tax Events</p>
            <p class="stat-value">${eventCount}</p>
          </div>
        </div>
      </div>
      
      ${renderCapitalGainsByYear(capitalGains)}
      ${renderBaseCosts(baseCosts)}
    `;
  }

  function renderCapitalGainsByYear(capitalGains) {
    if (!capitalGains || Object.keys(capitalGains).length === 0) {
      return "";
    }

    const years = Object.keys(capitalGains).sort(
      (a, b) => parseInt(b) - parseInt(a),
    );

    return `
      <div class="card">
        <h3 class="card-title">Capital Gains by Tax Year</h3>
        
        <div class="space-y-4">
          ${years
            .map((year) => {
              const yearData = capitalGains[year];
              const total = yearData.TOTAL || 0;
              const assets = Object.entries(yearData).filter(
                ([k]) => k !== "TOTAL",
              );

              return `
              <div class="tax-year-section">
                <div class="tax-year-header">
                  <h4 class="tax-year-title">Tax Year ${getTaxYearLabel(parseInt(year))}</h4>
                  <span class="tax-year-events ${total >= 0 ? "stat-value gain" : "stat-value loss"}">
                    ${total >= 0 ? "+" : ""}${formatZAR(total)}
                  </span>
                </div>
                
                ${
                  assets.length > 0
                    ? `
                  <div class="tax-year-stats">
                    ${assets
                      .map(
                        ([asset, gain]) => `
                      <div class="tax-year-stat">
                        <label>${asset}</label>
                        <span class="${gain >= 0 ? "stat-value gain" : "stat-value loss"}">
                          ${gain >= 0 ? "+" : ""}${formatZAR(gain)}
                        </span>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderBaseCosts(baseCosts) {
    if (!baseCosts || Object.keys(baseCosts).length === 0) {
      return "";
    }

    const assets = Object.entries(baseCosts).filter(
      ([_, data]) => data.quantity > 0,
    );

    if (assets.length === 0) {
      return "";
    }

    return `
      <div class="card">
        <h3 class="card-title">Current Holdings (Base Cost)</h3>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Base Cost</th>
                <th class="text-right">Avg Cost/Unit</th>
              </tr>
            </thead>
            <tbody>
              ${assets
                .map(
                  ([currency, data]) => `
                <tr>
                  <td class="font-medium">${currency}</td>
                  <td class="text-right">${formatCrypto(data.quantity)}</td>
                  <td class="text-right">${formatZAR(data.cost)}</td>
                  <td class="text-right text-gray-500">${formatZAR(data.cost / data.quantity)}</td>
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
   * Update the summary with new data
   * @param {Object} data - New calculation data
   */
  container.update = function (data) {
    render(data);
  };

  render(calculations);
  return container;
}
