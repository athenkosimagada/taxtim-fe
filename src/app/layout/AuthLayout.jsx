import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Crypto Tracker
        </h1>
        <nav className="space-x-4 text-lg text-gray-700">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/auth/login" className="hover:underline">
            Login
          </Link>
          <Link to="/auth/register" className="hover:underline">
            Register
          </Link>
        </nav>
      </header>

      <main className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Outlet />
      </main>
    </div>
  );
}
