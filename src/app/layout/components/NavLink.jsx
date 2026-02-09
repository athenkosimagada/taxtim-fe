import { Link } from "react-router-dom";

export default function NavLink({ to, children, variant = "text" }) {
  const base = "px-4 py-2 focus:outline-none rounded transition";

  const variants = {
    text: "text-gray-700 hover:text-blue-600",
    button:
      "px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300",
  };

  return (
    <Link to={to} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
