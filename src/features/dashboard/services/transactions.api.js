import httpClient from "../../../shared/services/httpClient";

export function postTransactions(transactions) {
  return httpClient.post("/transactions", transactions);
}

export function calculateTransactions() {
  return httpClient.get("/transactions/calculate");
}

export function deleteAllTransactions() {
  return httpClient.delete("/transactions");
}
