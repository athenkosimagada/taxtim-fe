/**
 * Alert Component
 * Shows error or success messages
 */

/**
 * Create an alert element
 * @param {string} message - Alert message
 * @param {string} type - 'error' or 'success'
 * @param {Function} onClose - Callback when closed
 * @returns {HTMLElement} Alert element
 */
export function createAlert(message, type = "error", onClose) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.id = "app-alert";

  alert.innerHTML = `
    <span><strong>${type === "error" ? "Error:" : "Success:"}</strong> ${message}</span>
    <button class="alert-close" aria-label="Close">×</button>
  `;

  alert.querySelector(".alert-close").addEventListener("click", () => {
    alert.remove();
    if (onClose) onClose();
  });

  return alert;
}

/**
 * Show alert in the app
 * @param {HTMLElement} container - Container to add alert to
 * @param {string} message - Alert message
 * @param {string} type - 'error' or 'success'
 */
export function showAlert(container, message, type = "error") {
  // Remove existing alert
  const existing = container.querySelector("#app-alert");
  if (existing) existing.remove();

  const alert = createAlert(message, type, () => {});
  container.insertBefore(alert, container.firstChild);

  // Auto-dismiss success alerts
  if (type === "success") {
    setTimeout(() => {
      if (alert.parentNode) alert.remove();
    }, 5000);
  }
}
