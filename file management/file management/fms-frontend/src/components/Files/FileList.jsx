import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import '../../styles/files.css';

const FileList = ({ files = [], searchTerm, filters, onFileSelect, onDelete, onEdit, onMovement, onBarcode }) => {
  const [loading] = useState(false);

  const filteredFiles = files.filter(file => {
    // Search filter
    if (searchTerm && !file.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !file.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !file.barcode.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && file.status !== filters.status) {
      return false;
    }
    
    // Company filter
    if (filters.company !== 'all' && file.company !== filters.company) {
      return false;
    }
    
    // Rack filter
    if (filters.rack !== 'all' && file.rack !== filters.rack) {
      return false;
    }
    
    return true;
  });

  const handleView = (file) => onFileSelect?.(file);
  const handleEdit = (file) => onEdit?.(file);
  const handleDelete = (file) => onDelete?.(file.id);
  const handleBarcode = (file) => onBarcode?.(file.id);
  const handleMovement = (file, action) => onMovement?.(file.id, action);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-header">
        <h3>Files ({filteredFiles.length})</h3>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>File ID</th>
              <th>File Title</th>
              <th>Company</th>
              <th>Rack</th>
              <th>Status</th>
              <th>Last Movement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file.id}>
                <td>
                  <strong>{file.id}</strong>
                  <div className="file-barcode">{file.barcode}</div>
                </td>
                <td>{file.title}</td>
                <td>{file.company}</td>
                <td>{file.rack}</td>
                <td>
                  <span className={`status-badge status-${file.status}`}>
                    {file.status.toUpperCase()}
                  </span>
                </td>
                <td>{file.lastMovement}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleView(file)}
                      title="View Details"
                    >
                      <VisibilityIcon />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleBarcode(file)}
                      title="Barcode"
                    >
                      <QrCodeIcon />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleMovement(file, 'out')}
                      title="Mark OUT"
                    >
                      <ArrowUpwardIcon />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleMovement(file, 'in')}
                      title="Mark IN"
                    >
                      <ArrowDownwardIcon />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(file)}
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(file)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredFiles.length === 0 && (
          <div className="empty-state">
            <p>No files found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;