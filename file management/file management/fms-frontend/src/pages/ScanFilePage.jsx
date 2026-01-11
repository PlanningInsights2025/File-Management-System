import React, { useState } from 'react';
import JsBarcode from 'jsbarcode';
import Layout from '../components/Layout/Layout';
import '../styles/scanFile.css';

const ScanFilePage = () => {
  const [activeTab, setActiveTab] = useState('scan');
  
  // Generate Tab State
  const [formData, setFormData] = useState({
    fileId: '',
    fileTitle: '',
    company: '',
    rack: '',
    barcodeFormat: 'CODE128',
    barcodeHeight: '100',
    barcodeWidth: '2'
  });
  const [generatedBarcode, setGeneratedBarcode] = useState(null);
  const [barcodeHistory, setBarcodeHistory] = useState([]);

  // Scan Tab State
  const [scanMethod, setScanMethod] = useState('manual');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [recentScans, setRecentScans] = useState([
    {
      id: 1,
      timestamp: '8/1/2026, 3:14:57 pm',
      fileId: '1024-ABCD-5678',
      success: true
    }
  ]);

  // Mock file database - replace with actual API call
  const mockFileDatabase = {
    '1024-ABCD-5678': {
      fileId: '1024-ABCD',
      title: 'Scanned File',
      company: 'Company A',
      rack: 'A-1',
      status: 'IN',
      responsible: 'John Doe',
      lastMovement: '2026-01-08'
    },
    'FMS-1024': {
      fileId: 'FMS-1024',
      title: 'Annual Budget 2024',
      company: 'Company A',
      rack: 'A-12',
      status: 'IN',
      responsible: 'Jane Smith',
      lastMovement: '2026-01-07'
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // === SCAN TAB FUNCTIONS ===
  const handleScan = () => {
    if (!barcodeInput.trim()) {
      alert('Please enter a barcode/File ID');
      return;
    }

    // Check if file exists in database
    const fileData = mockFileDatabase[barcodeInput];
    
    if (fileData) {
      setScannedData(fileData);
      setScanSuccess(true);
      
      // Add to recent scans
      const newScan = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        fileId: barcodeInput,
        success: true
      };
      setRecentScans([newScan, ...recentScans]);
    } else {
      setScanSuccess(false);
      setScannedData(null);
      alert('File not found in the system!');
    }
  };

  const handleRetryScan = () => {
    setBarcodeInput('');
    setScannedData(null);
    setScanSuccess(false);
  };

  const handleClear = () => {
    setBarcodeInput('');
    setScannedData(null);
    setScanSuccess(false);
  };

  const handleViewFullDetails = () => {
    alert(`Navigating to full details for ${scannedData.fileId}`);
    // Navigate to file details page
    // window.location.href = `/file-details/${scannedData.fileId}`;
  };

  const handleMarkAsOut = () => {
    if (scannedData) {
      setScannedData({...scannedData, status: 'OUT'});
      alert(`File ${scannedData.fileId} marked as OUT`);
    }
  };

  const handleMarkAsIn = () => {
    if (scannedData) {
      setScannedData({...scannedData, status: 'IN'});
      alert(`File ${scannedData.fileId} marked as IN`);
    }
  };

  // === GENERATE TAB FUNCTIONS ===

  const generateBarcode = () => {
    if (!formData.fileId) {
      alert('Please enter File ID');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, formData.fileId, {
        format: formData.barcodeFormat,
        width: parseInt(formData.barcodeWidth),
        height: parseInt(formData.barcodeHeight),
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: '#FFFFFF',
        lineColor: '#000000'
      });
      
      const barcodeUrl = canvas.toDataURL('image/png');
      setGeneratedBarcode(barcodeUrl);

      // Add to history
      const newHistory = {
        id: Date.now(),
        fileId: formData.fileId,
        fileTitle: formData.fileTitle,
        company: formData.company,
        rack: formData.rack,
        format: formData.barcodeFormat,
        barcode: barcodeUrl,
        timestamp: new Date().toLocaleString()
      };
      setBarcodeHistory([newHistory, ...barcodeHistory]);

      alert('Barcode generated successfully!');
    } catch (error) {
      console.error('Barcode generation error:', error);
      alert('Failed to generate barcode. Please check File ID format.');
    }
  };

  const handlePrint = () => {
    if (!generatedBarcode) {
      alert('Please generate a barcode first');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${formData.fileId}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            img { max-width: 100%; margin: 20px 0; }
            .info { text-align: center; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="info">
            <h2>${formData.fileTitle || 'File'}</h2>
            <p><strong>File ID:</strong> ${formData.fileId}</p>
            ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
            ${formData.rack ? `<p><strong>Rack:</strong> ${formData.rack}</p>` : ''}
          </div>
          <img src="${generatedBarcode}" alt="Barcode" />
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleDownload = () => {
    if (!generatedBarcode) {
      alert('Please generate a barcode first');
      return;
    }
    const link = document.createElement('a');
    link.download = `${formData.fileId}_barcode.png`;
    link.href = generatedBarcode;
    link.click();
  };

  const handleBatchPrint = () => {
    if (barcodeHistory.length === 0) {
      alert('No barcodes to print. Generate some barcodes first.');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    const barcodeHTML = barcodeHistory.map(item => `
      <div class="barcode-item">
        <h3>${item.fileTitle || 'File'}</h3>
        <p><strong>File ID:</strong> ${item.fileId}</p>
        ${item.company ? `<p><strong>Company:</strong> ${item.company}</p>` : ''}
        ${item.rack ? `<p><strong>Rack:</strong> ${item.rack}</p>` : ''}
        <img src="${item.barcode}" alt="Barcode" />
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Batch Print Barcodes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .barcode-item {
              page-break-inside: avoid;
              margin-bottom: 40px;
              text-align: center;
              border: 1px solid #ddd;
              padding: 20px;
            }
            img { max-width: 100%; margin: 15px 0; }
            @media print {
              .barcode-item { page-break-after: always; }
            }
          </style>
        </head>
        <body>${barcodeHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const clearForm = () => {
    setFormData({
      fileId: '',
      fileTitle: '',
      company: '',
      rack: '',
      barcodeFormat: 'CODE128',
      barcodeHeight: '100',
      barcodeWidth: '2'
    });
    setGeneratedBarcode(null);
  };

  return (
    <Layout>
      <div className="scan-file-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <div className="icon-wrapper">
              <svg width="40" height="40" fill="#4F46E5" viewBox="0 0 16 16">
                <path d="M0 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3zm5.5 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V3zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V3zm5.5-.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5h-1z"/>
              </svg>
            </div>
            <div>
              <h1>Barcode Management</h1>
              <p>Generate and manage barcodes for file tracking</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-batch" onClick={handleBatchPrint}>
              <svg width="20" height="20" fill="white" viewBox="0 0 16 16">
                <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
              </svg>
              Batch Print
            </button>
            <button className="btn-export-header">
              <svg width="20" height="20" fill="#4F46E5" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3z"/>
            </svg>
            <span>Generate</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3z"/>
            </svg>
            <span>Scan</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997z"/>
            </svg>
            <span>History</span>
          </button>
        </div>

        {/* SCAN TAB - 2 COLUMN LAYOUT */}
        {activeTab === 'scan' && (
          <div className="scan-grid-2col">
            {/* LEFT COLUMN - Scan Form */}
            <div className="scan-left-column">
              <div className="scan-card">
                <div className="scan-card-header">
                  <h2>Scan Barcode / QR Code</h2>
                </div>

                <div className="scan-card-body">
                  {/* Scan Method Toggle */}
                  <div className="scan-method-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="scanMethod"
                        value="camera"
                        checked={scanMethod === 'camera'}
                        onChange={(e) => setScanMethod(e.target.value)}
                      />
                      <span>Use Camera</span>
                    </label>
                    <label className="radio-label active">
                      <input
                        type="radio"
                        name="scanMethod"
                        value="manual"
                        checked={scanMethod === 'manual'}
                        onChange={(e) => setScanMethod(e.target.value)}
                      />
                      <span>Manual Entry</span>
                    </label>
                  </div>

                  {/* Barcode Input */}
                  <div className="form-group">
                    <label className="form-label">Enter Barcode / File ID</label>
                    <div className="input-with-button">
                      <input
                        type="text"
                        className="scan-input"
                        placeholder="e.g., 1024-ABCD-5678"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                      />
                      <button className="btn-scan" onClick={handleScan}>
                        <svg width="18" height="18" fill="white" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        Scan
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="scan-actions">
                    <button className="btn-clear" onClick={handleClear}>
                      Clear
                    </button>
                    <button className="btn-retry" onClick={handleRetryScan}>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                      </svg>
                      Retry Scan
                    </button>
                  </div>

                  {/* Recent Scans */}
                  <div className="recent-scans-section">
                    <h3>Recent Scans</h3>
                    <div className="recent-scans-list">
                      {recentScans.map((scan) => (
                        <div key={scan.id} className="recent-scan-item">
                          <div className="scan-info">
                            <span className="scan-time">{scan.timestamp}</span>
                            <span className="scan-id">{scan.fileId}</span>
                          </div>
                          <div className="scan-status-badge success">
                            <svg width="16" height="16" fill="white" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - File Information Display */}
            <div className="scan-right-column">
              <div className="info-card">
                {scannedData ? (
                  <>
                    {/* Success Header */}
                    <div className="success-header">
                      <svg width="24" height="24" fill="#10B981" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                      <h2>Scan Successful!</h2>
                    </div>

                    {/* File Information Section */}
                    <div className="file-info-section">
                      <h3>FILE INFORMATION</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">File ID:</span>
                          <span className="info-value">{scannedData.fileId}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Title:</span>
                          <span className="info-value">{scannedData.title}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Company:</span>
                          <span className="info-value">{scannedData.company}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Rack:</span>
                          <span className="info-value">{scannedData.rack}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Status:</span>
                          <span className={`status-badge ${scannedData.status.toLowerCase()}`}>
                            {scannedData.status}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Responsible:</span>
                          <span className="info-value">{scannedData.responsible}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Last Movement:</span>
                          <span className="info-value">{scannedData.lastMovement}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons-section">
                      <button className="btn-view-details" onClick={handleViewFullDetails}>
                        View Full Details
                      </button>
                      <button className="btn-mark-out" onClick={handleMarkAsOut}>
                        Mark as OUT
                      </button>
                      <button className="btn-mark-in" onClick={handleMarkAsIn}>
                        Mark as IN
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-scan-state">
                    <svg width="80" height="80" fill="#CBD5E1" viewBox="0 0 16 16">
                      <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    <h3>No File Scanned</h3>
                    <p>Scan or enter a barcode to view file information</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generate Tab - 2 Column Grid */}
        {activeTab === 'generate' && (
          <div className="content-grid-2col">
            {/* LEFT COLUMN - Form */}
            <div className="form-column">
              <div className="card">
                <div className="card-header">
                  <h2>Generate Barcode</h2>
                  <p>Fill in the file details to generate a barcode</p>
                </div>

                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">
                      File ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., FMS-1024"
                      value={formData.fileId}
                      onChange={(e) => handleInputChange('fileId', e.target.value)}
                    />
                    <small className="form-hint">Enter a unique file identifier</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">File Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Annual Budget 2024"
                      value={formData.fileTitle}
                      onChange={(e) => handleInputChange('fileTitle', e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Company</label>
                      <select
                        className="form-input"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      >
                        <option value="">Select Company</option>
                        <option value="Company A">Company A</option>
                        <option value="Company B">Company B</option>
                        <option value="Company C">Company C</option>
                        <option value="Company D">Company D</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Rack</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., A-12"
                        value={formData.rack}
                        onChange={(e) => handleInputChange('rack', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Barcode Format</label>
                    <select
                      className="form-input"
                      value={formData.barcodeFormat}
                      onChange={(e) => handleInputChange('barcodeFormat', e.target.value)}
                    >
                      <option value="CODE128">CODE128 (Recommended)</option>
                      <option value="CODE39">CODE39</option>
                      <option value="EAN13">EAN13</option>
                      <option value="UPC">UPC</option>
                      <option value="ITF14">ITF14</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Height (px)</label>
                      <select
                        className="form-input"
                        value={formData.barcodeHeight}
                        onChange={(e) => handleInputChange('barcodeHeight', e.target.value)}
                      >
                        <option value="50">50px (Small)</option>
                        <option value="75">75px</option>
                        <option value="100">100px (Medium)</option>
                        <option value="150">150px (Large)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Width Scale</label>
                      <select
                        className="form-input"
                        value={formData.barcodeWidth}
                        onChange={(e) => handleInputChange('barcodeWidth', e.target.value)}
                      >
                        <option value="1">Narrow</option>
                        <option value="2">Medium</option>
                        <option value="3">Wide</option>
                      </select>
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn-primary" onClick={generateBarcode}>
                      <svg width="18" height="18" fill="white" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                      Generate Barcode
                    </button>
                    <button className="btn-secondary" onClick={clearForm}>
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Preview */}
            <div className="preview-column">
              <div className="card">
                <div className="card-header-with-actions">
                  <div>
                    <h2>Preview</h2>
                    <p>Your generated barcode will appear here</p>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="icon-btn"
                      onClick={handlePrint}
                      disabled={!generatedBarcode}
                      title="Print"
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5z"/>
                      </svg>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={handleDownload}
                      disabled={!generatedBarcode}
                      title="Download"
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="preview-body">
                  {generatedBarcode ? (
                    <div className="barcode-preview-content">
                      <div className="barcode-image-wrapper">
                        <img src={generatedBarcode} alt="Generated Barcode" />
                      </div>
                      <div className="barcode-details">
                        <div className="detail-row">
                          <span className="detail-label">File ID:</span>
                          <span className="detail-value">{formData.fileId}</span>
                        </div>
                        {formData.fileTitle && (
                          <div className="detail-row">
                            <span className="detail-label">Title:</span>
                            <span className="detail-value">{formData.fileTitle}</span>
                          </div>
                        )}
                        {formData.company && (
                          <div className="detail-row">
                            <span className="detail-label">Company:</span>
                            <span className="detail-value">{formData.company}</span>
                          </div>
                        )}
                        {formData.rack && (
                          <div className="detail-row">
                            <span className="detail-label">Rack:</span>
                            <span className="detail-value">{formData.rack}</span>
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="detail-label">Format:</span>
                          <span className="detail-value">{formData.barcodeFormat}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg width="80" height="80" fill="#CBD5E1" viewBox="0 0 16 16">
                        <path d="M0 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3zm5.5 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V3z"/>
                      </svg>
                      <h3>No Barcode Generated</h3>
                      <p>Fill out the form and click "Generate Barcode"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan Tab */}
        {activeTab === 'scan-old' && (
          <div className="single-content">
            <div className="card">
              <div className="card-header">
                <h2>Scan Barcode</h2>
                <p>Use your camera or scanner to read barcodes</p>
              </div>
              <div className="card-body">
                <div className="scan-placeholder">
                  <svg width="100" height="100" fill="#94A3B8" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3z"/>
                  </svg>
                  <h3>Scanner Coming Soon</h3>
                  <p>Barcode scanning functionality will be available here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="single-content">
            <div className="card">
              <div className="card-header">
                <h2>Generation History</h2>
                <p>View all previously generated barcodes</p>
              </div>
              <div className="card-body">
                {barcodeHistory.length > 0 ? (
                  <div className="history-grid">
                    {barcodeHistory.map((item) => (
                      <div key={item.id} className="history-item">
                        <img src={item.barcode} alt="Barcode" />
                        <div className="history-info">
                          <strong>{item.fileId}</strong>
                          <p>{item.fileTitle}</p>
                          <small>{item.timestamp}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-history">
                    <p>No barcodes generated yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScanFilePage;
