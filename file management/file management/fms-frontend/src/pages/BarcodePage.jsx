import React, { useState, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import BarcodeGenerator from '../components/Barcode/BarcodeGenerator';
import BarcodeScanner from '../components/Barcode/BarcodeScanner';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/barcode.css';

const BarcodePage = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [scans, setScans] = useState([
    {
      id: 1,
      fileId: 'FMS-1024',
      barcode: '1024-ABCD-5678',
      type: 'Scan',
      user: 'John Doe',
      timestamp: '2024-01-23 10:30:45',
      status: 'success',
    },
    {
      id: 2,
      fileId: 'FMS-1025',
      barcode: '1025-EFGH-9012',
      type: 'Print',
      user: 'Jane Smith',
      timestamp: '2024-01-23 09:15:22',
      status: 'success',
    },
    {
      id: 3,
      fileId: 'FMS-1026',
      barcode: '1026-IJKL-3456',
      type: 'Scan',
      user: 'Bob Wilson',
      timestamp: '2024-01-22 15:45:33',
      status: 'failed',
    },
    {
      id: 4,
      fileId: 'FMS-1027',
      barcode: '1027-MNOP-7890',
      type: 'Print',
      user: 'Alice Brown',
      timestamp: '2024-01-22 11:20:18',
      status: 'success',
    },
  ]);

  // Batch Print Handler
  const handleBatchPrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('❌ Please allow pop-ups to print');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barcode History - Batch Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #333;
            border-bottom: 3px solid #667EEA;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #667EEA;
            color: white;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .status-success {
            color: #4CAF50;
            font-weight: 600;
          }
          .status-failed {
            color: #F44336;
            font-weight: 600;
          }
          .barcode {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 4px 8px;
            border-radius: 4px;
          }
          @media print {
            body { padding: 10px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>📋 Barcode History Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Records:</strong> ${scans.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>File ID</th>
              <th>Barcode</th>
              <th>Type</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${scans.map(scan => `
              <tr>
                <td><strong>${scan.fileId}</strong></td>
                <td><span class="barcode">${scan.barcode}</span></td>
                <td>${scan.type}</td>
                <td>${scan.user}</td>
                <td>${scan.timestamp}</td>
                <td class="status-${scan.status}">${scan.status.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      toast.success('🖨️ Print dialog opened');
    }, 250);
  };

  // Export Handler
  const handleExport = () => {
    // Create export options modal
    const exportFormat = window.confirm(
      'Choose export format:\n\nOK = Excel (.xlsx)\nCancel = PDF'
    );

    if (exportFormat) {
      // Export as Excel
      exportToExcel();
    } else {
      // Export as PDF
      exportToPDF();
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const worksheetData = scans.map(scan => ({
        'File ID': scan.fileId,
        'Barcode': scan.barcode,
        'Type': scan.type,
        'User': scan.user,
        'Timestamp': scan.timestamp,
        'Status': scan.status.toUpperCase()
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Barcode History');

      // Set column widths
      worksheet['!cols'] = [
        { wch: 15 }, // File ID
        { wch: 20 }, // Barcode
        { wch: 10 }, // Type
        { wch: 20 }, // User
        { wch: 20 }, // Timestamp
        { wch: 10 }  // Status
      ];

      const fileName = `Barcode_History_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success(`📥 Exported ${scans.length} records to Excel`);
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('❌ Failed to export to Excel');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(102, 126, 234);
      doc.text('Barcode History Report', 14, 22);
      
      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);
      doc.text(`Total Records: ${scans.length}`, 14, 38);

      // Prepare table data
      const tableData = scans.map(scan => [
        scan.fileId,
        scan.barcode,
        scan.type,
        scan.user,
        scan.timestamp,
        scan.status.toUpperCase()
      ]);

      // Add table
      doc.autoTable({
        startY: 45,
        head: [['File ID', 'Barcode', 'Type', 'User', 'Timestamp', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 5
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 40 },
          5: { cellWidth: 20 }
        }
      });

      const fileName = `Barcode_History_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success(`📥 Exported ${scans.length} records to PDF`);
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('❌ Failed to export to PDF');
    }
  };

  return (
    <Layout>
      <div className="barcode-page">
        <div className="page-header">
          <div className="header-left">
            <QrCodeIcon className="page-icon" />
            <div>
              <h2>Barcode & QR Code Management</h2>
              <p className="page-subtitle">Generate and scan barcodes for file tracking</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleBatchPrint}>
              <PrintIcon /> Batch Print
            </button>
            <button className="btn btn-secondary" onClick={handleExport}>
              <DownloadIcon /> Export
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
            >
              <QrCodeIcon /> Generate
            </button>
            <button
              className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
              onClick={() => setActiveTab('scan')}
            >
              <CameraAltIcon /> Scan
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'generate' && <BarcodeGenerator />}
          {activeTab === 'scan' && <BarcodeScanner />}
          {activeTab === 'history' && <BarcodeHistory scans={scans} />}
        </div>
      </div>
    </Layout>
  );
};

const BarcodeHistory = ({ scans }) => {

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>File ID</th>
              <th>Barcode</th>
              <th>Type</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td>
                  <strong>{scan.fileId}</strong>
                </td>
                <td>
                  <code>{scan.barcode}</code>
                </td>
                <td>
                  <span className={`type-badge type-${scan.type.toLowerCase()}`}>
                    {scan.type}
                  </span>
                </td>
                <td>{scan.user}</td>
                <td>{scan.timestamp}</td>
                <td>
                  <span className={`status-badge ${scan.status}`}>
                    {scan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarcodePage;