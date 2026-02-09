import { Link } from "react-router-dom";

export function HeroSection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl">
        {subtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={primaryAction.to}
          className="inline-block text-center px-6 py-4 text-lg font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {primaryAction.label}
        </Link>
        <Link
          to={secondaryAction.to}
          className="inline-block text-center px-6 py-4 text-lg font-semibold bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          {secondaryAction.label}
        </Link>
      </div>
    </section>
  );
}
