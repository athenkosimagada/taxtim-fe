import httpClient from "../../../shared/services/httpClient";

export function loginRequest(email, password) {
  return httpClient.post("/login", { email, password });
}

export function registerRequest(email, password) {
  return httpClient.post("/register", { email, password });
}
