import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const exportService = {
  // Export bill data as JSON
  async exportBill(billId) {
    const response = await api.get(`/bills/${billId}/export`);
    return response.data;
  },

  // Generate PDF from bill data
  generatePDF(exportData) {
    // This is a client-side PDF generation using jsPDF
    // You can enhance this with more sophisticated PDF generation
    return new Promise((resolve) => {
      // For now, we'll create a simple text-based export
      // In a real implementation, you'd use jsPDF or similar library
      const pdfContent = this.formatBillForPDF(exportData);
      resolve(pdfContent);
    });
  },

  // Format bill data for PDF export
  formatBillForPDF(data) {
    const { bill, participants, products, summary } = data;
    
    let content = '';
    content += `BILL EXPORT\n`;
    content += `============\n\n`;
    content += `Bill: ${bill.title}\n`;
    content += `Date: ${bill.created_at}\n`;
    content += `Total Amount: $${bill.total_amount}\n`;
    content += `Description: ${bill.description || 'No description'}\n\n`;
    
    content += `PARTICIPANTS\n`;
    content += `============\n`;
    participants.forEach((participant, index) => {
      content += `${index + 1}. ${participant.name} - $${participant.total_owed}\n`;
    });
    content += `\n`;
    
    content += `PRODUCTS\n`;
    content += `=========\n`;
    products.forEach((product, index) => {
      content += `${index + 1}. ${product.name}\n`;
      content += `   Price: $${product.price} x ${product.quantity} = $${product.total_cost}\n`;
      if (product.participants.length > 0) {
        content += `   Shared by: ${product.participants.map(p => `${p.name} ($${p.share_amount})`).join(', ')}\n`;
      }
      content += `\n`;
    });
    
    content += `SUMMARY\n`;
    content += `=======\n`;
    content += `Total Items: ${summary.total_items}\n`;
    content += `Total Participants: ${summary.total_participants}\n`;
    content += `Total Amount: $${summary.total_amount}\n`;
    content += `Generated: ${summary.generated_at}\n`;
    
    return content;
  },

  // Download as text file
  downloadAsText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export bill as text file
  async exportBillAsText(billId, filename) {
    try {
      const exportData = await this.exportBill(billId);
      const content = this.formatBillForPDF(exportData);
      this.downloadAsText(content, filename || `bill-${billId}.txt`);
      return { success: true };
    } catch (error) {
      console.error('Export error:', error);
      let errorMessage = 'Failed to export bill';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Export bill as CSV
  async exportBillAsCSV(billId, filename) {
    try {
      const exportData = await this.exportBill(billId);
      const csvContent = this.formatBillForCSV(exportData);
      this.downloadAsText(csvContent, filename || `bill-${billId}.csv`);
      return { success: true };
    } catch (error) {
      console.error('CSV Export error:', error);
      return { success: false, error: error.message };
    }
  },

  // Format bill data for CSV export
  formatBillForCSV(data) {
    const { bill, participants, products, summary } = data;
    
    let csv = 'Bill Title,Date,Total Amount,Description\n';
    csv += `"${bill.title}","${bill.created_at}","${bill.total_amount}","${bill.description || ''}"\n\n`;
    
    csv += 'Participant Name,Total Owed\n';
    participants.forEach(participant => {
      csv += `"${participant.name}","${participant.total_owed}"\n`;
    });
    csv += '\n';
    
    csv += 'Product Name,Price,Quantity,Total Cost,Shared By\n';
    products.forEach(product => {
      const sharedBy = product.participants.length > 0 
        ? product.participants.map(p => p.name).join('; ')
        : 'Not assigned';
      csv += `"${product.name}","${product.price}","${product.quantity}","${product.total_cost}","${sharedBy}"\n`;
    });
    
    return csv;
  }
};

export default exportService; 