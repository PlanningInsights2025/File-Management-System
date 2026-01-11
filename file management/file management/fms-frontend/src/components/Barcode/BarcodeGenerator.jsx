import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../../styles/barcode.css';

const BarcodeGenerator = () => {
  const [fileId, setFileId] = useState('FMS-1024');
  const [fileTitle, setFileTitle] = useState('Annual Budget 2024');
  const [company, setCompany] = useState('Company A');
  const [rack, setRack] = useState('A-12');
  const [barcodeData, setBarcodeData] = useState('FMS-1024-ABCD-5678');
  const [qrSize, setQrSize] = useState(200);
  const [copied, setCopied] = useState(false);

  const generateBarcode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const random = Array.from({ length: 12 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    setBarcodeData(`${fileId}-${random}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(barcodeData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              text-align: center;
            }
            .barcode-label {
              border: 1px solid #000;
              padding: 20px;
              width: 300px;
              margin: 0 auto;
            }
            .file-title { font-size: 18px; font-weight: bold; }
            .file-id { font-size: 14px; margin: 10px 0; }
            .company { font-size: 12px; color: #666; }
            .rack { font-size: 12px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="barcode-label">
            <div class="file-title">${fileTitle}</div>
            <div class="file-id">${fileId}</div>
            <div class="company">${company}</div>
            <div class="rack">Rack: ${rack}</div>
            <div style="margin: 20px 0;">
              <svg>${document.querySelector('svg').outerHTML}</svg>
            </div>
            <div style="font-family: monospace; font-size: 14px; margin-top: 10px;">
              ${barcodeData}
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const svg = document.querySelector('svg');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob(['<?xml version="1.0" standalone="no"?>\r\n' + source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${fileId}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="barcode-generator">
        <div className="generator-left">
          <h3>Generate Barcode / QR Code</h3>
          
          <div className="form-group">
            <label className="form-label">File ID</label>
            <input
              type="text"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              className="form-input"
              placeholder="Enter file ID"
            />
          </div>

          <div className="form-group">
            <label className="form-label">File Title</label>
            <input
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className="form-input"
              placeholder="Enter file title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-select"
              >
                <option value="Company A">Company A</option>
                <option value="Company B">Company B</option>
                <option value="Company C">Company C</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rack</label>
              <input
                type="text"
                value={rack}
                onChange={(e) => setRack(e.target.value)}
                className="form-input"
                placeholder="Enter rack location"
              />
            </div>
          </div>

          {/* QR Code Size slider removed. QR code will be fixed size. */}

          <div className="form-actions">
            <button className="btn btn-primary" onClick={generateBarcode}>
              <RefreshIcon /> Generate New Code
            </button>
            <button className="btn btn-secondary" onClick={handleCopy}>
              <ContentCopyIcon /> {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        <div className="generator-right">
          <div className="barcode-preview">
            <div className="preview-header">
              <h4>Preview</h4>
              <div className="preview-actions">
                <button className="btn-icon" onClick={handlePrint} title="Print">
                  <PrintIcon />
                </button>
                <button className="btn-icon" onClick={handleDownload} title="Download">
                  <DownloadIcon />
                </button>
              </div>
            </div>

            <div className="qr-code-container">
              <QRCode
                value={`https://company.com/file/view?id=${fileId}&barcode=${barcodeData}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="barcode-info">
              <div className="info-item">
                <strong>File:</strong> {fileTitle}
              </div>
              <div className="info-item">
                <strong>ID:</strong> {fileId}
              </div>
              <div className="info-item">
                <strong>Company:</strong> {company}
              </div>
              <div className="info-item">
                <strong>Rack:</strong> {rack}
              </div>
              <div className="info-item">
                <strong>Barcode:</strong>
                <code className="barcode-value">{barcodeData}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;