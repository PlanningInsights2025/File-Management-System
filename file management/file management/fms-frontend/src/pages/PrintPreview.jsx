import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/printPreview.css';

const PrintPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileData = location.state?.fileData;

  useEffect(() => {
    // Check if fileData exists
    if (!fileData) {
      navigate('/files/create');
    }
  }, [fileData, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    window.close();
    // Fallback if window.close() doesn't work
    setTimeout(() => navigate('/files/create'), 100);
  };

  if (!fileData) {
    return null;
  }

  return (
    <div className="print-preview-container">
      {/* Action Buttons - Hidden during print */}
      <div className="print-actions no-print">
        <button onClick={handlePrint} className="btn-print-action">
          <PrintIcon /> Print
        </button>
        <button onClick={handleClose} className="btn-close-action">
          <CloseIcon /> Close
        </button>
      </div>

      {/* Printable Content */}
      <div className="printable-pages">
        {/* Page 1: Barcode Label */}
        <div className="print-page barcode-label-page">
          <div className="print-header">
            <h3>FILE MANAGEMENT SYSTEM</h3>
            <div className="cut-line">✂ Cut Here ✂</div>
          </div>

          <div className="label-content">
            <div className="label-left">
              <h4>File Information</h4>
              <table className="file-info-table">
                <tbody>
                  <tr>
                    <td className="label-cell">File ID:</td>
                    <td className="value-cell">{fileData.barcodeValue}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">File Name:</td>
                    <td className="value-cell">{fileData.fileName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Company:</td>
                    <td className="value-cell">{fileData.company || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Department:</td>
                    <td className="value-cell">{fileData.department || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Created By:</td>
                    <td className="value-cell">{fileData.createdBy || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">File Location:</td>
                    <td className="value-cell">{fileData.location || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Created Date:</td>
                    <td className="value-cell">
                      {fileData.createdDate ? new Date(fileData.createdDate).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">Purpose:</td>
                    <td className="value-cell">{fileData.purpose || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="label-right">
              <div className="barcode-wrapper">
                <Barcode
                  value={fileData.barcodeValue}
                  format="CODE128"
                  width={2}
                  height={80}
                  displayValue={true}
                  fontSize={14}
                  margin={10}
                />
              </div>
            </div>
          </div>

          <div className="cut-line bottom">✂ Cut Here ✂</div>
        </div>

        {/* Page 2: Index Page */}
        <div className="print-page index-page">
          <div className="index-header">
            <div className="index-barcode-wrapper">
              <Barcode
                value={fileData.barcodeValue}
                format="CODE128"
                width={1.5}
                height={60}
                displayValue={true}
                fontSize={12}
                margin={5}
              />
            </div>
          </div>

          <div className="file-number-center">
            File No: {fileData.barcodeValue}
          </div>

          <div className="index-contents">
            <h2 className="toc-heading">TABLE OF CONTENTS</h2>
            <table className="contents-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Document Name</th>
                  <th>Page No.</th>
                  <th>Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="signature-section">
            <div className="signature-row">
              <div className="signature-field">
                <span className="sig-label">Prepared By:</span>
                <span className="sig-value">{fileData.createdBy || '_________________'}</span>
              </div>
              <div className="signature-field">
                <span className="sig-label">Date:</span>
                <span className="sig-value">
                  {fileData.createdDate ? new Date(fileData.createdDate).toLocaleDateString('en-GB') : '__________'}
                </span>
              </div>
            </div>
            <div className="signature-row">
              <div className="signature-field">
                <span className="sig-label">Approved By:</span>
                <span className="sig-value">_________________</span>
              </div>
              <div className="signature-field">
                <span className="sig-label">Date:</span>
                <span className="sig-value">__________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
