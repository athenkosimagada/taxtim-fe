import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import NavLink from "./NavLink";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/auth/login");
  }

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="text-2xl font-bold text-blue-600 flex items-center">
          <NavLink to="/">Crypto Tracker</NavLink>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-md focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div
          className={`w-full sm:w-auto flex flex-col sm:flex-row gap-4 text-lg mt-4 sm:mt-0 ${
            menuOpen ? "block" : "hidden"
          } sm:block`}
        >
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <button
                onClick={handleLogout}
                className="text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink
                to="/auth/login"
                variant="button"
                className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
