export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Crypto Tracker — Simple, Safe, and Easy
      </div>
    </footer>
  );
}
