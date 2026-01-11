import React, { useState } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import PrintIcon from '@mui/icons-material/Print';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import '../../styles/files.css';

const FileDetails = ({ file }) => {
  const [movementHistory, setMovementHistory] = useState([
    {
      id: 1,
      action: 'OUT',
      user: 'John Doe',
      purpose: 'Review',
      date: '2024-01-22',
      time: '10:30 AM',
      expectedReturn: '2024-01-25',
    },
    {
      id: 2,
      action: 'IN',
      user: 'Jane Smith',
      purpose: 'Returned',
      date: '2024-01-18',
      time: '3:45 PM',
    },
    {
      id: 3,
      action: 'OUT',
      user: 'Bob Wilson',
      purpose: 'Meeting',
      date: '2024-01-15',
      time: '2:15 PM',
      expectedReturn: '2024-01-17',
    },
  ]);

  const handleMarkOut = () => {
    console.log('Mark file OUT:', file.id);
  };

  const handleMarkIn = () => {
    console.log('Mark file IN:', file.id);
  };

  const handlePrintIndex = () => {
    console.log('Print index page for:', file.id);
    alert('Index page sent to printer');
  };

  const handleViewHistory = () => {
    console.log('View full history for:', file.id);
  };

  return (
    <div className="file-details">
      <div className="details-header">
        <h3>File Details</h3>
        <div className="detail-actions">
          <button className="btn-icon" title="Edit">
            <EditIcon />
          </button>
          <button className="btn-icon" title="Barcode">
            <QrCodeIcon />
          </button>
          <button className="btn-icon" title="Print Index">
            <PrintIcon />
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="detail-section">
          <h4>Basic Information</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">File ID:</span>
              <span className="detail-value">{file.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Barcode:</span>
              <span className="detail-value">{file.barcode}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{file.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Company:</span>
              <span className="detail-value">{file.company}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rack:</span>
              <span className="detail-value">{file.rack}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`status-badge status-${file.status}`}>
                {file.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Personnel</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Prepared By:</span>
              <span className="detail-value">{file.preparedBy}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Responsible:</span>
              <span className="detail-value">{file.responsiblePerson}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{file.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button className="btn btn-danger" onClick={handleMarkOut}>
              <ArrowUpwardIcon /> Mark OUT
            </button>
            <button className="btn btn-success" onClick={handleMarkIn}>
              <ArrowDownwardIcon /> Mark IN
            </button>
            <button className="btn btn-secondary" onClick={handlePrintIndex}>
              <PrintIcon /> Print Index
            </button>
          </div>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h4>Recent Movements</h4>
            <button className="btn-text" onClick={handleViewHistory}>
              <HistoryIcon /> Full History
            </button>
          </div>
          
          <div className="movement-list">
            {movementHistory.map((movement) => (
              <div key={movement.id} className="movement-item">
                <div className="movement-header">
                  <span className={`movement-action ${movement.action.toLowerCase()}`}>
                    {movement.action}
                  </span>
                  <span className="movement-time">{movement.date} • {movement.time}</span>
                </div>
                <div className="movement-content">
                  <p><strong>By:</strong> {movement.user}</p>
                  <p><strong>Purpose:</strong> {movement.purpose}</p>
                  {movement.expectedReturn && (
                    <p><strong>Expected Return:</strong> {movement.expectedReturn}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;