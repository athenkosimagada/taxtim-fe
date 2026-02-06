export function Button({ children, onClick, variant = "primary" }) {
  const base = "px-5 py-2 rounded text-sm font-medium transition";

  const styles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-slate-200 hover:bg-slate-300",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
