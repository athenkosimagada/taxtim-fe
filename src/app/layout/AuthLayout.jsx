import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <header className="mb-8 text-center">
        <div className="site-logo mb-2">Crypto Tracker</div>
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

      <main className="w-full max-w-md card">
        <Outlet />
      </main>
    </div>
  );
}
