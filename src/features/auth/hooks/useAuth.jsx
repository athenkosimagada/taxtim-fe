import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest } from "../services/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  async function login(email, password) {
    try {
      setLoading(true);
      setError(null);

      const response = await loginRequest(email, password);

      if (!response?.token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", response.token);
      setToken(response.token);
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(email, password) {
    try {
      setLoading(true);
      setError(null);
      await registerRequest(email, password);
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
