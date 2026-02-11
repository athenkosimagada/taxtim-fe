/**
 * Excel Upload Component
 * Handles Excel file upload and processing
 */
export function createExcelUpload(config) {
  const container = document.createElement("div");
  container.className = "card";
  
  // File input state
  let currentFile = null;
  let isProcessing = false;
  
  function render() {
    container.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">
          <span class="mr-2">📊</span>
          Bulk Upload via Excel
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          Upload Excel (.xlsx, .xls) or CSV file with your transactions
        </p>
      </div>
      
      <div class="card-body">
        <input type="file" id="excel-file-input" class="hidden" accept=".xlsx,.xls,.csv" />
        
        <div class="drop-zone ${currentFile ? 'drop-zone-has-file' : ''}" id="drop-zone">
          <div class="drop-zone-content">
            ${currentFile ? renderFilePreview() : renderUploadPrompt()}
          </div>
        </div>
        
        <div class="mt-4 flex flex-col md:flex-row gap-3">
          <button class="btn-outline flex-1" id="download-template-btn">
            📥 Download Template
          </button>
          <button class="btn-primary flex-1 ${!currentFile || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}" 
                  id="process-excel-btn" ${!currentFile || isProcessing ? 'disabled' : ''}>
            ${isProcessing ? 'Processing...' : 'Process Excel File'}
          </button>
        </div>
        
        <div class="mt-4 text-xs text-gray-500">
          <p>Supported formats: .xlsx, .xls, .csv</p>
          <p class="mt-1">Template columns: Date, Type, SellCoin, SellAmount, BuyCoin, BuyAmount, BuyPricePerCoin</p>
        </div>
      </div>
    `;
    
    attachEventListeners();
  }
  
  function renderUploadPrompt() {
    return `
      <div class="text-center py-8">
        <div class="text-4xl mb-4">📁</div>
        <p class="text-lg font-medium mb-2">Drag & drop your file here</p>
        <p class="text-gray-500 mb-4">or click to browse</p>
        <button class="btn-secondary" type="button" id="browse-btn">
          Choose Excel File
        </button>
      </div>
    `;
  }
  
  function renderFilePreview() {
    if (!currentFile) return '';
    
    const fileSize = (currentFile.size / 1024).toFixed(2);
    
    return `
      <div class="text-center py-4">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <span class="text-xl">📄</span>
        </div>
        <p class="font-medium text-green-600 mb-1">${currentFile.name}</p>
        <p class="text-sm text-gray-500">${fileSize} KB</p>
        <button class="mt-3 text-sm text-blue-600 hover:text-blue-800" type="button" id="change-file-btn">
          Change file
        </button>
      </div>
    `;
  }
  
  function attachEventListeners() {
    const fileInput = container.querySelector("#excel-file-input");
    const dropZone = container.querySelector("#drop-zone");
    const browseBtn = container.querySelector("#browse-btn");
    const changeFileBtn = container.querySelector("#change-file-btn");
    const processBtn = container.querySelector("#process-excel-btn");
    const downloadBtn = container.querySelector("#download-template-btn");
    
    // File selection
    if (browseBtn) {
      browseBtn.addEventListener("click", () => fileInput.click());
    }
    
    if (changeFileBtn) {
      changeFileBtn.addEventListener("click", () => fileInput.click());
    }
    
    fileInput.addEventListener("change", handleFileSelect);
    
    // Drag and drop
    if (dropZone) {
      dropZone.addEventListener("dragover", handleDragOver);
      dropZone.addEventListener("dragleave", handleDragLeave);
      dropZone.addEventListener("drop", handleDrop);
    }
    
    // Process button
    if (processBtn) {
      processBtn.addEventListener("click", handleProcess);
    }
    
    // Download template
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        if (config.onDownloadTemplate) config.onDownloadTemplate();
      });
    }
  }
  
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!isValidExcelFile(file)) {
      alert("Please upload an Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    
    currentFile = file;
    
    if (config.onFileSelect) {
      config.onFileSelect(file);
    }
    
    render();
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropZone = container.querySelector("#drop-zone");
    if (dropZone) {
      dropZone.classList.add("drop-zone-dragover");
    }
  }
  
  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropZone = container.querySelector("#drop-zone");
    if (dropZone) {
      dropZone.classList.remove("drop-zone-dragover");
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropZone = container.querySelector("#drop-zone");
    if (dropZone) {
      dropZone.classList.remove("drop-zone-dragover");
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      if (!isValidExcelFile(file)) {
        alert("Please upload an Excel (.xlsx, .xls) or CSV file.");
        return;
      }
      
      // Create a fake event to mimic file input
      const event = {
        target: {
          files: [file]
        }
      };
      handleFileSelect(event);
    }
  }
  
  async function handleProcess() {
    if (!currentFile || isProcessing) return;
    
    isProcessing = true;
    render();
    
    try {
      if (config.onProcess) {
        await config.onProcess(currentFile);
      }
    } catch (error) {
      console.error("Excel processing error:", error);
    } finally {
      isProcessing = false;
      render();
    }
  }
  
  function isValidExcelFile(file) {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  }
  
  /**
   * Clear the current file selection
   */
  container.clear = function() {
    currentFile = null;
    isProcessing = false;
    render();
  };
  
  /**
   * Get the current file
   */
  container.getCurrentFile = function() {
    return currentFile;
  };
  
  // Initial render
  render();
  
  return container;
}