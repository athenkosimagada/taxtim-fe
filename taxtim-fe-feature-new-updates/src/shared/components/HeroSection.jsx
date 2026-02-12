import { Link } from "react-router-dom";

export default function HeroSection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">{title}</h1>
          <p className="text-lg md:text-xl text-muted mb-6 max-w-3xl">{subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={primaryAction.to} className="btn btn-primary inline-block text-lg">
              {primaryAction.label}
            </Link>
            <Link to={secondaryAction.to} className="btn btn-secondary inline-block text-lg">
              {secondaryAction.label}
            </Link>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-md illustration">
          <div className="mb-4">
            <img src="/logo.svg" alt="Crypto Tracker logo" className="w-28 h-auto rounded-xl" />
          </div>
          <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="600" height="400" rx="20" fill="url(#g1)" opacity="0.08" />

            <g transform="translate(40,30)">
              <circle cx="160" cy="120" r="80" fill="url(#g2)" opacity="0.12" />
              <rect x="260" y="50" width="200" height="120" rx="14" fill="#fff" opacity="0.85" />
              <circle cx="420" cy="220" r="60" fill="#fff" opacity="0.9" />

              <g transform="translate(270,70)">
                <rect width="140" height="18" rx="6" fill="#eef2ff" />
                <rect y="28" width="100" height="12" rx="6" fill="#f0fdf4" />
                <rect y="48" width="120" height="12" rx="6" fill="#f8fafc" />
              </g>
            </g>

            <g transform="translate(40,30)" fill="#fff" opacity="0.9">
              <text x="20" y="320" fontSize="20" fontWeight="700" fill="#072140">Insights • Taxes • Simplicity</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
