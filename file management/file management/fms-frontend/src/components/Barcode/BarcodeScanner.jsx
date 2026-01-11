import React, { useState } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../../styles/barcode.css';

const BarcodeScanner = () => {
  const [scanMethod, setScanMethod] = useState('camera');
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedFile, setScannedFile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const handleScan = () => {
    if (scanMethod === 'manual') {
      if (!scanResult) {
        alert('Please enter a barcode to scan');
        return;
      }
      simulateScan(scanResult);
    } else {
      setScanning(true);
      // Simulate camera scan
      setTimeout(() => {
        const mockBarcode = `FMS-${Math.floor(Math.random() * 9000 + 1000)}-ABCD-${Math.floor(Math.random() * 9000 + 1000)}`;
        simulateScan(mockBarcode);
        setScanning(false);
      }, 2000);
    }
  };

  const simulateScan = (barcode) => {
    // Mock file data based on barcode
    const mockFile = {
      id: barcode.split('-')[0] + '-' + barcode.split('-')[1],
      title: 'Scanned File',
      company: 'Company A',
      rack: 'A-' + Math.floor(Math.random() * 20 + 1),
      status: Math.random() > 0.5 ? 'in' : 'out',
      lastMovement: new Date().toISOString().split('T')[0],
      responsiblePerson: 'John Doe',
    };

    setScannedFile(mockFile);
    setScanHistory(prev => [
      {
        barcode,
        timestamp: new Date().toLocaleString(),
        success: true,
      },
      ...prev.slice(0, 4)
    ]);
  };

  const handleClear = () => {
    setScanResult('');
    setScannedFile(null);
  };

  const handleRetry = () => {
    setScanning(true);
    setTimeout(() => {
      simulateScan(scanResult || `FMS-${Math.floor(Math.random() * 9000 + 1000)}-EFGH-${Math.floor(Math.random() * 9000 + 1000)}`);
      setScanning(false);
    }, 1000);
  };

  return (
    <div className="card">
      <div className="barcode-scanner">
        <div className="scanner-left">
          <h3>Scan Barcode / QR Code</h3>
          
          <div className="scan-method">
            <div className="method-options">
              <label className="method-option">
                <input
                  type="radio"
                  name="scanMethod"
                  value="camera"
                  checked={scanMethod === 'camera'}
                  onChange={(e) => setScanMethod(e.target.value)}
                />
                <span>Use Camera</span>
              </label>
              <label className="method-option">
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
          </div>

          {scanMethod === 'manual' ? (
            <div className="form-group">
              <label className="form-label">Enter Barcode / File ID</label>
              <div className="manual-input">
                <input
                  type="text"
                  value={scanResult}
                  onChange={(e) => setScanResult(e.target.value)}
                  className="form-input"
                  placeholder="Enter barcode or scan with camera"
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                />
                <button className="btn btn-primary" onClick={handleScan}>
                  <SearchIcon /> Scan
                </button>
              </div>
            </div>
          ) : (
            <div className="camera-preview">
              <div className="camera-placeholder">
                <CameraAltIcon />
                <p>Camera Preview</p>
                {scanning ? (
                  <div className="scanning-overlay">
                    <div className="scanning-line"></div>
                    <p>Scanning...</p>
                  </div>
                ) : (
                  <div className="scan-instructions">
                    <p>Point camera at barcode</p>
                    <p>Ensure good lighting</p>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-primary scan-button"
                onClick={handleScan}
                disabled={scanning}
              >
                {scanning ? 'Scanning...' : 'Start Scanning'}
              </button>
            </div>
          )}

          <div className="scan-actions">
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
            <button className="btn btn-primary" onClick={handleRetry}>
              <RefreshIcon /> Retry Scan
            </button>
          </div>

          <div className="scan-history">
            <h4>Recent Scans</h4>
            {scanHistory.length === 0 ? (
              <p className="no-history">No recent scans</p>
            ) : (
              <div className="history-list">
                {scanHistory.map((scan, index) => (
                  <div key={index} className="history-item">
                    <div className="history-time">{scan.timestamp}</div>
                    <div className="history-barcode">{scan.barcode}</div>
                    <div className={`history-status ${scan.success ? 'success' : 'error'}`}>
                      {scan.success ? <CheckCircleIcon /> : <ErrorIcon />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="scanner-right">
          {scannedFile ? (
            <div className="scan-result">
              <div className="result-header success">
                <CheckCircleIcon />
                <h4>Scan Successful!</h4>
              </div>
              
              <div className="file-details">
                <h5>File Information</h5>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">File ID:</span>
                    <span className="detail-value">{scannedFile.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{scannedFile.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{scannedFile.company}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rack:</span>
                    <span className="detail-value">{scannedFile.rack}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge status-${scannedFile.status}`}>
                      {scannedFile.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Responsible:</span>
                    <span className="detail-value">{scannedFile.responsiblePerson}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Movement:</span>
                    <span className="detail-value">{scannedFile.lastMovement}</span>
                  </div>
                </div>
              </div>

              <div className="result-actions">
                <button className="btn btn-primary">
                  View Full Details
                </button>
                <button className="btn btn-success">
                  Mark as OUT
                </button>
                <button className="btn btn-warning">
                  Mark as IN
                </button>
              </div>
            </div>
          ) : (
            <div className="scan-result">
              <div className="result-header">
                <ErrorIcon />
                <h4>No Scan Result</h4>
              </div>
              <div className="result-placeholder">
                <p>Scan a barcode to see file details</p>
                <p>Use the camera or manual entry on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;