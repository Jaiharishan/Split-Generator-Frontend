import React, { useState, useRef } from 'react';
import { Upload, FileText, Settings, Check, X, RotateCcw, Trash2, Eye, File } from 'lucide-react';
import { ocrService } from '../services/ocrService';

function ReceiptParser({ onProductsExtracted }) {
  const [processing, setProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [parsingMode, setParsingMode] = useState('auto'); // 'auto', 'manual', 'advanced'
  const [manualText, setManualText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    setSelectedFile(file);

    try {
      setProcessing(true);
      setOcrResult(null);
      
      let result;
      
      switch (parsingMode) {
        case 'advanced':
          result = await ocrService.processReceiptAdvanced(file);
          break;
        case 'manual':
          // For manual mode, we'll use the text input
          return;
        default:
          result = await ocrService.processFile(file);
      }
      
      setOcrResult(result);
      
      if (result.success && result.products.length > 0) {
        onProductsExtracted(result.products);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualParse = () => {
    if (!manualText.trim()) {
      alert('Please enter receipt text');
      return;
    }

    const products = ocrService.parseReceiptText(manualText);
    setOcrResult({
      success: true,
      text: manualText,
      products: products
    });
    
    if (products.length > 0) {
      onProductsExtracted(products);
    }
  };

  const retryWithDifferentMode = async () => {
    if (!ocrResult || !ocrResult.text) return;
    
    // Try different parsing strategies on the same text
    const products = ocrService.improveProductDetection(ocrResult.products);
    
    setOcrResult({
      ...ocrResult,
      products: products
    });
    
    if (products.length > 0) {
      onProductsExtracted(products);
    }
  };

  const clearAll = () => {
    setOcrResult(null);
    setShowRawText(false);
    setManualText('');
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetFileUpload = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setOcrResult(null);
    setShowRawText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const reprocessFile = async () => {
    if (!selectedFile) return;

    try {
      setProcessing(true);
      setOcrResult(null);
      
      let result;
      
      switch (parsingMode) {
        case 'advanced':
          result = await ocrService.processReceiptAdvanced(selectedFile);
          break;
        default:
          result = await ocrService.processFile(selectedFile);
      }
      
      setOcrResult(result);
      
      if (result.success && result.products.length > 0) {
        onProductsExtracted(result.products);
      }
    } catch (error) {
      console.error('Error reprocessing file:', error);
      alert('Failed to reprocess file. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getFileTypeInfo = (file) => {
    if (!file) return null;
    return ocrService.getFileTypeInfo(file);
  };

  return (
    <div className="space-y-6">
      {/* Parsing Mode Selection */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Receipt Processing Options
            </h2>
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setParsingMode('auto')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                parsingMode === 'auto'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center mb-2">
                <Upload className="h-5 w-5 mr-2 text-primary-600" />
                <span className="font-medium">Auto Processing</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload image or PDF for automatic text extraction and product detection
              </p>
            </button>

            <button
              type="button"
              onClick={() => setParsingMode('advanced')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                parsingMode === 'advanced'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center mb-2">
                <Settings className="h-5 w-5 mr-2 text-primary-600" />
                <span className="font-medium">Advanced Processing</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enhanced processing with better text cleaning and pattern matching
              </p>
            </button>

            <button
              type="button"
              onClick={() => setParsingMode('manual')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                parsingMode === 'manual'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-primary-600" />
                <span className="font-medium">Manual Input</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Type or paste receipt text manually for parsing
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      {parsingMode !== 'manual' && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Receipt</h2>
              {selectedFile && (
                <button
                  type="button"
                  onClick={resetFileUpload}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="card-body">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upload an image or PDF of your receipt for automatic processing
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Supported formats: JPG, PNG, GIF, PDF
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={processing}
                  className="hidden"
                  id="receipt-upload"
                />
                <label
                  htmlFor="receipt-upload"
                  className="btn-secondary cursor-pointer"
                >
                  {processing ? 'Processing...' : 'Choose File'}
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileTypeInfo(selectedFile)?.icon && (
                      <span className="text-2xl">{getFileTypeInfo(selectedFile).icon}</span>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {getFileTypeInfo(selectedFile)?.description} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetFileUpload}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                    </div>
                    <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Receipt preview"
                        className="w-full max-h-64 object-contain bg-gray-50"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={reprocessFile}
                          disabled={processing}
                          className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
                        >
                          <RotateCcw className={`h-4 w-4 text-gray-600 ${processing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Info */}
                {selectedFile.type === 'application/pdf' && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <File className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">PDF Document</p>
                      <p className="text-xs text-blue-700">
                        Text will be extracted from all pages of the PDF
                      </p>
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {processing && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-3"></div>
                    <span className="text-sm text-gray-700">
                      Processing {selectedFile.type === 'application/pdf' ? 'PDF' : 'image'}...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Text Input */}
      {parsingMode === 'manual' && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Enter Receipt Text</h2>
              <button
                type="button"
                onClick={() => setManualText('')}
                className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </button>
            </div>
          </div>
          <div className="card-body">
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              className="input w-full h-32"
              placeholder="Paste your receipt text here...&#10;&#10;Example:&#10;MILK 2.99&#10;BREAD 3.50&#10;APPLES 4.99"
            />
            <div className="flex items-center justify-between mt-3">
              <button
                type="button"
                onClick={handleManualParse}
                className="btn-primary"
              >
                Parse Receipt
              </button>
              <span className="text-xs text-gray-500">
                {manualText.length} characters
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Processing Results */}
      {ocrResult && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Processing Results</h2>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Extracted Data</h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRawText(!showRawText)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showRawText ? 'Hide' : 'Show'} Raw Text
                </button>
                {ocrResult.products.length === 0 && (
                  <button
                    type="button"
                    onClick={retryWithDifferentMode}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Try Different Parsing
                  </button>
                )}
              </div>
            </div>
            
            {showRawText && (
              <div className="mb-4 p-3 bg-gray-50 border rounded text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {ocrResult.text}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Products Found:</span>
                <span className="text-sm font-medium text-gray-900">
                  {ocrResult.products.length}
                </span>
              </div>
              
              {ocrResult.fileType === 'pdf' && ocrResult.pageCount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pages Processed:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {ocrResult.pageCount}
                  </span>
                </div>
              )}

              {ocrResult.fileType === 'pdf' && ocrResult.method && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Processing Method:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {ocrResult.method === 'ocr' ? 'OCR (Image Conversion)' : 'Text Extraction'}
                  </span>
                </div>
              )}
              
              {ocrResult.products.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm text-success-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Products have been added to your bill
                  </div>
                  <div className="text-xs text-gray-500">
                    You can edit product names and prices in the form below
                  </div>
                </div>
              ) : (
                <div className="text-sm text-warning-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  No products detected. Try a different file or parsing mode.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptParser; 