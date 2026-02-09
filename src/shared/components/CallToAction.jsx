import { Link } from "react-router-dom";

export function CallToAction({ message, button }) {
  return (
    <section className="bg-blue-600 text-white rounded-2xl p-10 text-center">
      <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">{message}</p>
      <Link
        to={button.to}
        className="inline-block px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white"
      >
        {button.label}
      </Link>
    </section>
  );
}
