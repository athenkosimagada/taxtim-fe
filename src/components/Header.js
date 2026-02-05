/**
 * Header Component
 * Creates the application header with branding
 */
export function createHeader() {
  const header = document.createElement("header");
  header.className = "header";

  header.innerHTML = `
    <div class="container">
      <div class="header-content">
        <div class="header-brand">
          <div class="header-logo">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <div>
            <h1 class="header-title">TaxTim</h1>
            <p class="header-subtitle">Crypto FIFO Tax Calculator</p>
          </div>
        </div>
        <div class="header-badge">
          SARS Compliant
        </div>
      </div>
    </div>
  `;

  return header;
}
