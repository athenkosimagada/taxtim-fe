/**
 * Tabs Component
 * Navigation tabs for different views
 */

/**
 * Create tabs navigation
 * @param {Array} tabs - Array of {id, label} objects
 * @param {string} activeTab - Currently active tab id
 * @param {Function} onChange - Callback when tab changes
 * @returns {HTMLElement} Tabs element
 */
export function createTabs(tabs, activeTab, onChange) {
  const container = document.createElement("div");
  container.className = "tabs";
  container.id = "results-tabs";

  function render(active) {
    container.innerHTML = tabs
      .map(
        (tab) => `
      <button class="tab ${active === tab.id ? "active" : ""}" data-tab="${tab.id}">
        ${tab.label}
      </button>
    `,
      )
      .join("");

    container.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.target.dataset.tab;
        if (onChange) onChange(tabId);
      });
    });
  }

  /**
   * Update active tab
   * @param {string} tabId - Tab ID to activate
   */
  container.setActive = function (tabId) {
    render(tabId);
  };

  render(activeTab);
  return container;
}
