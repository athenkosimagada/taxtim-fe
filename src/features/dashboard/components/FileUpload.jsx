import { Upload, FileText, X } from "lucide-react";

export default function FileUpload({
  fileName,
  fileInputRef,
  onFileChange,
  onClear,
}) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">
            Upload Excel file
          </h3>
          <p className="text-gray-900 text-xs mt-1">
            .xlsx, .xls, .csv up to 10MB
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-900 rounded-xl p-8 text-center hover:border-[#3B82F6]/50 transition group">
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={onFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <Upload className="w-10 h-10 text-gray-900 mx-auto mb-3 group-hover:text-[#93C5FD] transition" />
          <p className="text-gray-900 text-sm mb-1">
            Choose file or drag & drop
          </p>
          <p className="text-white/40 text-xs">Click to browse</p>
        </label>

        {fileName && (
          <div className="mt-4 rounded-lg p-3 flex items-center justify-between border border-[#3B82F6]/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#93C5FD]" />
              <span className="text-gray-900 text-sm truncate max-w-[200px]">
                {fileName}
              </span>
            </div>
            <button
              onClick={onClear}
              className="text-gray-900 hover:text-gray-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
