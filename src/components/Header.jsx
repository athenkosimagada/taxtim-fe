export default function Header() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-lg font-bold">
          ₿
        </div>
        <div>
          <h1 className="text-xl text-white font-semibold">
            Crypto Tax Calculator
          </h1>
          <p className="text-white text-sm">
            FIFO · South Africa · Capital Gains
          </p>
        </div>
      </div>
    </header>
  );
}
