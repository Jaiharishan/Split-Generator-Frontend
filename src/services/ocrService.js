import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Don't configure worker - let PDF.js handle it automatically
// This should work for basic PDF text extraction

export const ocrService = {
  // Process file (image or PDF) using appropriate method
  async processFile(file) {
    try {
      console.log('Starting file processing...', file.type);
      
      if (file.type === 'application/pdf') {
        return await this.processPDF(file);
      } else if (file.type.startsWith('image/')) {
        return await this.processImage(file);
      } else {
        throw new Error('Unsupported file type. Please upload an image or PDF.');
      }
    } catch (error) {
      console.error('File processing error:', error);
      return {
        success: false,
        error: error.message,
        products: []
      };
    }
  },

  // Process image using Tesseract.js OCR
  async processImage(file) {
    try {
      console.log('Starting OCR processing...');
      
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => console.log(m)
        }
      );

      console.log('OCR Result:', result.data.text);
      
      // Parse the extracted text to find products and prices
      const products = this.parseReceiptText(result.data.text);
      
      return {
        success: true,
        text: result.data.text,
        products: products,
        fileType: 'image'
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      return {
        success: false,
        error: error.message,
        products: []
      };
    }
  },

  // Process PDF using PDF.js with improved text extraction
  async processPDF(file) {
    try {
      console.log('Starting PDF processing...');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      let allTextItems = [];
      
      // Extract text from all pages with better positioning
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Sort text items by vertical position (top to bottom)
        const sortedItems = textContent.items.sort((a, b) => {
          // Sort by y position (top to bottom), then by x position (left to right)
          if (Math.abs(a.transform[5] - b.transform[5]) < 5) {
            return a.transform[4] - b.transform[4];
          }
          return b.transform[5] - a.transform[5];
        });
        
        // Build text with proper spacing
        let pageText = '';
        let lastY = null;
        let lastX = null;
        
        for (const item of sortedItems) {
          const currentY = item.transform[5];
          const currentX = item.transform[4];
          
          // Add line break if significant vertical gap
          if (lastY !== null && Math.abs(currentY - lastY) > 10) {
            pageText += '\n';
          }
          // Add space if horizontal gap
          else if (lastX !== null && currentX - lastX > 20) {
            pageText += ' ';
          }
          
          pageText += item.str;
          lastY = currentY;
          lastX = currentX + (item.width || 0);
        }
        
        fullText += pageText + '\n\n';
        allTextItems.push(...sortedItems);
      }

      console.log('PDF Text Result:', fullText);
      
      // Try multiple parsing strategies
      let products = this.parseReceiptText(fullText);
      
      // If no products found, try alternative parsing
      if (products.length === 0) {
        products = this.parseEbillText(allTextItems);
      }
      
      // If still no products found, try OCR fallback
      if (products.length === 0) {
        console.log('Text extraction failed, trying OCR fallback...');
        return await this.processPDFWithOCR(file);
      }
      
      return {
        success: true,
        text: fullText,
        products: products,
        fileType: 'pdf',
        pageCount: pdf.numPages
      };
    } catch (error) {
      console.error('PDF processing error:', error);
      return {
        success: false,
        error: error.message,
        products: []
      };
    }
  },

  // Fallback method: Convert PDF to image and use OCR
  async processPDFWithOCR(file) {
    try {
      console.log('Converting PDF to image for OCR processing...');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Convert first page to image
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });
      
      // Process with OCR
      const result = await Tesseract.recognize(
        blob,
        'eng',
        {
          logger: m => console.log(m)
        }
      );

      console.log('OCR Result from PDF:', result.data.text);
      
      // Parse the extracted text
      const products = this.parseReceiptText(result.data.text);
      
      return {
        success: true,
        text: result.data.text,
        products: products,
        fileType: 'pdf',
        pageCount: pdf.numPages,
        method: 'ocr'
      };
    } catch (error) {
      console.error('PDF OCR fallback error:', error);
      return {
        success: false,
        error: 'Failed to process PDF with both text extraction and OCR',
        products: []
      };
    }
  },

  // Special parsing for e-bills with complex layouts
  parseEbillText(textItems) {
    const products = [];
    const lines = [];
    
    // Group text items by vertical position to form lines
    let currentLine = [];
    let lastY = null;
    
    for (const item of textItems) {
      const currentY = item.transform[5];
      
      if (lastY === null || Math.abs(currentY - lastY) < 5) {
        currentLine.push(item);
      } else {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [item];
      }
      lastY = currentY;
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    // Process each line
    for (const line of lines) {
      const lineText = line.map(item => item.str).join(' ');
      const product = this.extractProductFromLine(lineText);
      if (product) {
        products.push(product);
      }
    }
    
    return products;
  },

  // Extract product information from a single line
  extractProductFromLine(lineText) {
    // Walmart grocery e-bill patterns
    const patterns = [
      // Pattern: "ITEM NAME $XX.XX" or "ITEM NAME XX.XX"
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+\$?(\d+\.\d{2})/,
      // Pattern: "ITEM NAME QTY X $XX.XX" 
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+(\d+)\s+x\s+\$?(\d+\.\d{2})/,
      // Pattern: "ITEM NAME @ $XX.XX EA"
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+@\s+\$?(\d+\.\d{2})\s+EA/,
      // Pattern: "ITEM NAME - $XX.XX"
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+-\s+\$?(\d+\.\d{2})/,
      // Pattern: "ITEM NAME (QTY) $XX.XX"
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s*\((\d+)\)\s+\$?(\d+\.\d{2})/,
      // Pattern: "ITEM NAME * $XX.XX"
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+\*\s+\$?(\d+\.\d{2})/
    ];

    for (const pattern of patterns) {
      const match = lineText.match(pattern);
      if (match) {
        let productName, price;
        
        if (match.length === 3) {
          // Simple pattern: item price
          productName = match[1].trim();
          price = parseFloat(match[2]);
        } else if (match.length === 4) {
          // Quantity pattern
          productName = match[1].trim();
          const quantity = parseInt(match[2]);
          price = parseFloat(match[3]);
        }
        
        if (this.isValidProduct(productName, price)) {
          return {
            name: this.cleanProductName(productName),
            price: price,
            participants: []
          };
        }
      }
    }
    
    return null;
  },

  // Parse receipt text to extract products and prices
  parseReceiptText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const products = [];
    
    // Common patterns for receipt items
    const patterns = [
      // Pattern: Item name followed by price (e.g., "MILK 2.99")
      /^([A-Za-z\s]+)\s+(\d+\.\d{2})$/,
      // Pattern: Item name with price at end (e.g., "BREAD 3.50")
      /^(.+?)\s+(\d+\.\d{2})\s*$/,
      // Pattern: Item with quantity and price (e.g., "2 MILK @ 1.99 EA 3.98")
      /^(\d+)\s+([A-Za-z\s]+)\s+@\s+(\d+\.\d{2})\s+EA\s+(\d+\.\d{2})/,
      // Pattern: Simple item and price (e.g., "APPLE 0.99")
      /^([A-Za-z\s]+)\s+(\d+\.\d{2})/,
      // Pattern: E-bill specific patterns (e.g., "Product Name $12.34")
      /^([A-Za-z\s]+)\s+\$(\d+\.\d{2})/,
      // Pattern: E-bill with description (e.g., "GROCERY ITEM DESCRIPTION $5.67")
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+\$(\d+\.\d{2})/,
      // Pattern: Walmart specific patterns
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+(\d+)\s+x\s+\$?(\d+\.\d{2})/,
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+@\s+\$?(\d+\.\d{2})\s+EA/,
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+-\s+\$?(\d+\.\d{2})/,
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s*\((\d+)\)\s+\$?(\d+\.\d{2})/,
      /^([A-Za-z\s]+(?:\s+[A-Za-z\s]+)*)\s+\*\s+\$?(\d+\.\d{2})/
    ];

    for (const line of lines) {
      let matched = false;
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          let productName, price;
          
          if (match.length === 3) {
            // Simple pattern: item price
            productName = match[1].trim();
            price = parseFloat(match[2]);
          } else if (match.length === 5) {
            // Quantity pattern: qty item @ price EA total
            const quantity = parseInt(match[1]);
            productName = match[2].trim();
            const unitPrice = parseFloat(match[3]);
            price = parseFloat(match[4]);
          } else if (match.length === 4) {
            // Quantity pattern: item qty x price
            productName = match[1].trim();
            const quantity = parseInt(match[2]);
            price = parseFloat(match[3]);
          }
          
          // Filter out common non-product lines
          if (this.isValidProduct(productName, price)) {
            products.push({
              name: this.cleanProductName(productName),
              price: price,
              participants: []
            });
            matched = true;
            break;
          }
        }
      }
      
      // If no pattern matched, try to extract manually
      if (!matched) {
        const manualExtract = this.manualExtract(line);
        if (manualExtract) {
          products.push(manualExtract);
        }
      }
    }
    
    return products;
  },

  // Check if extracted item is a valid product
  isValidProduct(name, price) {
    if (!name || !price || price <= 0) return false;
    
    // Filter out common receipt headers/footers
    const invalidKeywords = [
      'total', 'subtotal', 'tax', 'change', 'cash', 'card', 'debit', 'credit',
      'receipt', 'store', 'date', 'time', 'register', 'transaction', 'thank',
      'welcome', 'please', 'return', 'exchange', 'refund', 'discount', 'sale',
      'coupon', 'loyalty', 'points', 'balance', 'amount', 'due', 'paid',
      'invoice', 'bill', 'statement', 'account', 'customer', 'order',
      'shipping', 'handling', 'delivery', 'service', 'charge', 'fee',
      'walmart', 'grocery', 'pickup', 'delivery', 'order', 'number',
      'customer', 'service', 'phone', 'email', 'address', 'website'
    ];
    
    const lowerName = name.toLowerCase();
    return !invalidKeywords.some(keyword => lowerName.includes(keyword));
  },

  // Clean product name
  cleanProductName(name) {
    return name
      .replace(/^\d+\s*/, '') // Remove leading numbers
      .replace(/\s+@\s+\d+\.\d{2}\s+EA.*$/, '') // Remove quantity/price suffixes
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  },

  // Manual extraction for lines that don't match patterns
  manualExtract(line) {
    // Look for price at the end of line
    const priceMatch = line.match(/(\d+\.\d{2})\s*$/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      const name = line.replace(priceMatch[0], '').trim();
      
      if (this.isValidProduct(name, price)) {
        return {
          name: this.cleanProductName(name),
          price: price,
          participants: []
        };
      }
    }
    
    return null;
  },

  // Enhanced parsing with better receipt understanding
  async processReceiptAdvanced(file) {
    const basicResult = await this.processFile(file);
    
    if (!basicResult.success) {
      return basicResult;
    }
    
    // Try to improve the parsing with additional logic
    const improvedProducts = this.improveProductDetection(basicResult.products);
    
    return {
      ...basicResult,
      products: improvedProducts
    };
  },

  // Improve product detection with additional logic
  improveProductDetection(products) {
    return products.map(product => {
      // Clean up common OCR artifacts
      let cleanName = product.name
        .replace(/[^\w\s]/g, ' ') // Remove special characters
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      // Capitalize first letter of each word
      cleanName = cleanName.replace(/\b\w/g, l => l.toUpperCase());
      
      return {
        ...product,
        name: cleanName
      };
    }).filter(product => product.name.length > 0);
  },

  // Get file type information
  getFileTypeInfo(file) {
    if (file.type === 'application/pdf') {
      return {
        type: 'PDF',
        icon: '📄',
        description: 'PDF Document'
      };
    } else if (file.type.startsWith('image/')) {
      return {
        type: 'Image',
        icon: '🖼️',
        description: 'Image File'
      };
    } else {
      return {
        type: 'Unknown',
        icon: '❓',
        description: 'Unsupported File Type'
      };
    }
  }
}; 