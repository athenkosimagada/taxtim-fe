import { Link } from "react-router-dom";

export default function NavLink({ to, children, variant = "text" }) {
  const base = "focus:outline-none rounded transition";

  const variants = {
    text: "text-gray-700 hover:text-blue-600 px-3 py-1",
    button: "btn btn-primary",
  };

  return (
    <Link to={to} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
