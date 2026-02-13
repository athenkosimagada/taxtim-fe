import { Link } from "react-router-dom";
import { ArrowRight, Shield, Upload, Calculator, FileText, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1E33] flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-6">
        <div className="text-center">
          
          {/* SARS Badge */}
          <div className="inline-flex items-center bg-[#1E3A5F] text-[#93C5FD] px-5 py-2 rounded-full text-xs font-medium border border-[#3B82F6]/30 mb-8">
            <Shield className="w-3.5 h-3.5 mr-2" />
            SARS FIFO · Free forever
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">TaxTim</h1>
          <p className="text-xl text-white/70 mb-2">Your crypto tax is due.</p>
          <p className="text-2xl font-semibold text-[#93C5FD] mb-10">We'll handle it in 3 clicks.</p>

          {/* THREE SIMPLE STEPS - ONE PLACE, NOT REPEATED */}
          <div className="flex items-center justify-between gap-4 mb-12 max-w-2xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex-1 bg-[#13293D] rounded-xl p-5 border border-white/10">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-sm font-bold text-white">1</span>
              </div>
              <Upload className="w-5 h-5 text-[#93C5FD] mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Upload</h3>
              <p className="text-xs text-white/50">Excel or CSV</p>
              <p className="text-xs text-[#93C5FD] mt-2">Instant FIFO</p>
            </div>
            
            {/* Arrow */}
            <div className="text-white/20 text-xl">→</div>
            
            {/* Step 2 */}
            <div className="flex-1 bg-[#13293D] rounded-xl p-5 border border-white/10">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-sm font-bold text-white">2</span>
              </div>
              <Calculator className="w-5 h-5 text-[#93C5FD] mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Calculate</h3>
              <p className="text-xs text-white/50">Base cost + Gains</p>
              <p className="text-xs text-[#93C5FD] mt-2">SARS ready</p>
            </div>
            
            {/* Arrow */}
            <div className="text-white/20 text-xl">→</div>
            
            {/* Step 3 */}
            <div className="flex-1 bg-[#13293D] rounded-xl p-5 border border-white/10">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-sm font-bold text-white">3</span>
              </div>
              <FileText className="w-5 h-5 text-[#93C5FD] mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Report</h3>
              <p className="text-xs text-white/50">Tax year summary</p>
              <p className="text-xs text-[#93C5FD] mt-2">eFiling ready</p>
            </div>
          </div>

          {/* ONE CTA - CLEAR ACTION */}
          <Link
            to="/dashboard"
            className="inline-flex bg-[#3B82F6] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#2563eb] transition shadow-lg shadow-blue-500/30 items-center gap-2 text-lg mb-6"
          >
            Let's get started
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* TRUST LINE - NO REPETITION */}
          <div className="flex items-center justify-center gap-4 text-xs text-white/40">
            <span>100% free</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>No credit card</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>No catch</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <Clock className="w-3 h-3" />
            <span>60 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}