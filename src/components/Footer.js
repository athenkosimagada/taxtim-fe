/**
 * Footer Component
 */
export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";

  footer.innerHTML = `
    <div class="container">
      <p>TaxTim Crypto FIFO Tax Calculator — SARS Compliant</p>
      <p>For educational and demonstration purposes only. Consult a tax professional for advice.</p>
    </div>
  `;

  return footer;
}
