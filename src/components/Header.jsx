export default function Header() {
  return (
    <header className="bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <div className="text-xl font-bold">₿</div>
        <div>
          <h1 className="text-lg font-semibold">Crypto Tax FIFO Calculator</h1>
          <p className="text-sm text-slate-300">SARS-compliant capital gains</p>
        </div>
      </div>
    </header>
  );
}
