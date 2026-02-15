import { ArrowRight } from "lucide-react";

export default function ClearButton({ onClick }) {
  return (
    <div className="text-right mt-8">
      <button
        onClick={onClick}
        className="text-white/40 hover:text-white/60 text-sm transition flex items-center gap-2 ml-auto group bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full"
      >
        Clear & start over
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </button>
    </div>
  );
}
