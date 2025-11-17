// Export Service for CSV and PDF exports
export class ExportService {
  static exportToCSV(data: Record<string, unknown>[], filename: string) {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, `${filename}.csv`);
  }

  static exportToPDF(data: Record<string, unknown>[], filename: string, title: string) {
    // Simple PDF-like text export (requires html2pdf library for true PDF)
    const content = [
      `${title}\n`,
      `Export Date: ${new Date().toLocaleDateString()}\n`,
      `Total Records: ${data.length}\n\n`,
      '='.repeat(80) + '\n',
    ];

    // Add headers
    const headers = Object.keys(data[0]);
    content.push(headers.join(' | ') + '\n');
    content.push('='.repeat(80) + '\n');

    // Add data
    data.forEach((row) => {
      const values = headers.map((header) => String(row[header] || ''));
      content.push(values.join(' | ') + '\n');
    });

    // Create blob and download
    const text = content.join('');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    this.downloadFile(blob, `${filename}.txt`);
  }

  static exportTransactionsAsJSON(transactions: Record<string, unknown>[], filename: string) {
    const data = {
      exportDate: new Date().toISOString(),
      totalTransactions: transactions.length,
      transactions,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    this.downloadFile(blob, `${filename}.json`);
  }

  static exportReport(reportData: Record<string, unknown>, filename: string, format: 'json' | 'csv' | 'txt' = 'json') {
    let content: string;
    let type: string;
    let extension: string;

    switch (format) {
      case 'csv':
        content = this.objectToCSV(reportData);
        type = 'text/csv;charset=utf-8;';
        extension = '.csv';
        break;
      case 'txt':
        content = this.objectToText(reportData);
        type = 'text/plain;charset=utf-8;';
        extension = '.txt';
        break;
      default:
        content = JSON.stringify(reportData, null, 2);
        type = 'application/json;charset=utf-8;';
        extension = '.json';
    }

    const blob = new Blob([content], { type });
    this.downloadFile(blob, `${filename}${extension}`);
  }

  private static objectToCSV(obj: Record<string, unknown>): string {
    const lines: string[] = [];

    const addLine = (key: string, value: unknown, indent = '') => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        lines.push(`${indent}${key}:`);
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
          addLine(k, v, indent + '  ');
        });
      } else if (Array.isArray(value)) {
        lines.push(`${indent}${key}: [Array(${value.length})]`);
      } else {
        lines.push(`${indent}${key},${value}`);
      }
    };

    Object.entries(obj).forEach(([key, value]) => {
      addLine(key, value);
    });

    return lines.join('\n');
  }

  private static objectToText(obj: Record<string, unknown>): string {
    const lines: string[] = [];
    lines.push('='.repeat(80));
    lines.push('REPORT');
    lines.push('='.repeat(80));
    lines.push(`Generated: ${new Date().toLocaleString()}\n`);

    const formatValue = (value: unknown, indent = ''): string[] => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const result: string[] = [];
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
          result.push(`${indent}${k}:`);
          result.push(...formatValue(v, indent + '  '));
        });
        return result;
      } else if (Array.isArray(value)) {
        return [`${indent}[Array with ${value.length} items]`];
      } else {
        return [`${indent}${value}`];
      }
    };

    Object.entries(obj).forEach(([key, value]) => {
      lines.push(`${key}:`);
      lines.push(...formatValue(value, '  '));
      lines.push('');
    });

    lines.push('='.repeat(80));

    return lines.join('\n');
  }

  private static downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  static printTable(data: Record<string, unknown>[], title: string = 'Report') {
    const headers = Object.keys(data[0]);
    let content = `<h1>${title}</h1>`;
    content += `<p>Generated: ${new Date().toLocaleString()}</p>`;
    content += '<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">';
    content += '<thead><tr>';

    headers.forEach((header) => {
      content += `<th style="background-color: #6d28d9; color: white;">${header}</th>`;
    });

    content += '</tr></thead><tbody>';

    data.forEach((row, index) => {
      content += '<tr>';
      headers.forEach((header) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        content += `<td style="background-color: ${bgColor};">${row[header] || ''}</td>`;
      });
      content += '</tr>';
    });

    content += '</tbody></table>';

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; }
              h1 { color: #6d28d9; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
