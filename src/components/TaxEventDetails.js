/**
 * Tax Event Details Component
 * Shows detailed breakdown of each tax event with FIFO lot usage
 */
import { formatZAR, formatCrypto, formatDate } from "../utils/formatters.js";

/**
 * Create the tax event details component
 * @param {Object} calculations - FIFO calculation results from backend
 * @returns {HTMLElement} Tax event details element
 */
export function createTaxEventDetails(calculations) {
  const container = document.createElement("div");
  container.className = "card";
  container.id = "tax-event-details";

  let expandedEvent = null;

  function render(data) {
    if (!data || !data.calculations || data.calculations.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No tax events yet. Add SELL or TRADE transactions to see tax calculations.</p>
        </div>
      `;
      return;
    }

    const { calculations: events } = data;

    container.innerHTML = `
      <h2 class="card-title">Tax Event Details</h2>
      <p class="text-sm text-gray-500 mb-6">
        Click on any event to see the FIFO lot breakdown
      </p>
      
      <div class="space-y-4" id="events-container">
        ${events.map((event, idx) => renderEvent(event, idx)).join("")}
      </div>
    `;

    // Attach event listeners
    container.querySelectorAll(".event-header").forEach((header) => {
      header.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx);
        expandedEvent = expandedEvent === idx ? null : idx;
        render(data);
      });
    });
  }

  function renderEvent(event, idx) {
    const isExpanded = expandedEvent === idx;
    const typeClass = event.type === "SELL" ? "badge-sell" : "badge-trade";
    const gainClass = event.gain >= 0 ? "positive" : "negative";

    let eventTitle = "";
    if (event.type === "TRADE") {
      eventTitle = `${formatCrypto(event.soldQuantity)} ${event.from} → ${event.to}`;
    } else {
      eventTitle = `${formatCrypto(event.quantity)} ${event.asset}`;
    }

    return `
      <div class="event-item">
        <button class="event-header" data-idx="${idx}">
          <div class="event-header-left">
            <span class="badge ${typeClass}">${event.type}</span>
            <span class="text-sm text-gray-500">${formatDate(event.date)}</span>
            <span class="font-medium">${eventTitle}</span>
          </div>
          <div class="event-header-right">
            <span class="event-gain ${gainClass}">
              ${event.gain >= 0 ? "+" : ""}${formatZAR(event.gain)}
            </span>
            <span class="event-arrow">${isExpanded ? "▲" : "▼"}</span>
          </div>
        </button>
        
        ${isExpanded ? renderEventDetails(event) : ""}
      </div>
    `;
  }

  function renderEventDetails(event) {
    return `
      <div class="event-details">
        <div class="event-stats">
          <div class="event-stat">
            <label>Proceeds</label>
            <span>${formatZAR(event.proceeds)}</span>
          </div>
          <div class="event-stat">
            <label>FIFO Cost</label>
            <span>${formatZAR(event.cost)}</span>
          </div>
          <div class="event-stat">
            <label>${event.gain >= 0 ? "Capital Gain" : "Capital Loss"}</label>
            <span class="${event.gain >= 0 ? "stat-value gain" : "stat-value loss"}">
              ${formatZAR(Math.abs(event.gain))}
            </span>
          </div>
        </div>
        
        ${event.lots && event.lots.length > 0 ? renderLotBreakdown(event.lots) : ""}
      </div>
    `;
  }

  function renderLotBreakdown(lots) {
    return `
      <div class="mt-4">
        <h4 class="text-sm font-medium text-gray-700 mb-4">FIFO Lot Breakdown</h4>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Lot Date</th>
                <th class="text-right">Amount Used</th>
                <th class="text-right">Cost/Unit</th>
                <th class="text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              ${lots
                .map(
                  (lot) => `
                <tr>
                  <td>${formatDate(lot.date)}</td>
                  <td class="text-right">${formatCrypto(lot.quantity)} ${lot.asset}</td>
                  <td class="text-right">${formatZAR(lot.unitPriceZar)}</td>
                  <td class="text-right">${formatZAR(lot.cost)}</td>
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
    expandedEvent = null;
    render(data);
  };

  render(calculations);
  return container;
}
