import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match");
      return;
    }
    await register(email, password);
    navigate("/auth/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {errorMessage}
        </div>
      )}
      <div>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="form-label">
          Confirm Password
        </label>
        <input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirm your password"
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Registering..." : "Create Account"}
      </button>
    </form>
  );
}
