import { httpClient } from "../../../shared/services/httpClient";

export function loginApi(email, password) {
  return httpClient("/login", {
    method: "POST",
    body: { email, password },
  });
}

export function registerApi(email, password) {
  return httpClient("/register", {
    method: "POST",
    body: { email, password },
  });
}
