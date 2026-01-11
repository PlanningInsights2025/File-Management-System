import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import '../../styles/files.css';

const FileForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    company: '',
    fileTitle: '',
    preparedBy: '',
    purpose: '',
    description: '',
    responsiblePerson: '',
    rack: '',
    department: '',
    fileType: 'general',
  });

  const [errors, setErrors] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');

  const companies = ['Company A', 'Company B', 'Company C', 'Company D'];
  const racks = ['Rack A-01', 'Rack A-02', 'Rack A-03', 'Rack B-01', 'Rack B-02', 'Rack C-01'];
  const departments = ['HR', 'Finance', 'Operations', 'IT', 'Marketing', 'Sales'];
  const fileTypes = ['General', 'Confidential', 'Legal', 'Financial', 'Project'];

  const generateFileId = () => {
    const prefix = 'FMS';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${random}-${timestamp}`;
  };

  const generateBarcode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let barcode = '';
    for (let i = 0; i < 12; i++) {
      barcode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return barcode;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.fileTitle) newErrors.fileTitle = 'File title is required';
    if (!formData.preparedBy) newErrors.preparedBy = 'Prepared by is required';
    if (!formData.responsiblePerson) newErrors.responsiblePerson = 'Responsible person is required';
    if (!formData.rack) newErrors.rack = 'Rack location is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate file data
    const fileData = {
      ...formData,
      id: generateFileId(),
      barcode: generateBarcode(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'in',
    };

    console.log('File created:', fileData);
    onSuccess?.(fileData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is filled
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleGeneratePreview = () => {
    const fileId = generateFileId();
    const barcode = generateBarcode();
    setGeneratedCode({
      fileId,
      barcode,
    });
  };

  const handlePrintLabel = () => {
    // Print barcode label
    console.log('Printing label for:', generatedCode);
    alert('Barcode label sent to printer');
  };

  return (
    <form onSubmit={handleSubmit} className="file-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Company *</label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`form-select ${errors.company ? 'error' : ''}`}
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          {errors.company && <span className="error-text">{errors.company}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">File Title *</label>
          <input
            type="text"
            name="fileTitle"
            value={formData.fileTitle}
            onChange={handleChange}
            className={`form-input ${errors.fileTitle ? 'error' : ''}`}
            placeholder="Enter file title"
          />
          {errors.fileTitle && <span className="error-text">{errors.fileTitle}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Prepared By *</label>
          <input
            type="text"
            name="preparedBy"
            value={formData.preparedBy}
            onChange={handleChange}
            className={`form-input ${errors.preparedBy ? 'error' : ''}`}
            placeholder="Name of person who prepared"
          />
          {errors.preparedBy && <span className="error-text">{errors.preparedBy}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Responsible Person *</label>
          <input
            type="text"
            name="responsiblePerson"
            value={formData.responsiblePerson}
            onChange={handleChange}
            className={`form-input ${errors.responsiblePerson ? 'error' : ''}`}
            placeholder="File owner"
          />
          {errors.responsiblePerson && <span className="error-text">{errors.responsiblePerson}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">File Type</label>
          <select
            name="fileType"
            value={formData.fileType}
            onChange={handleChange}
            className="form-select"
          >
            {fileTypes.map((type) => (
              <option key={type.toLowerCase()} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Rack / Shelf Location *</label>
        <select
          name="rack"
          value={formData.rack}
          onChange={handleChange}
          className={`form-select ${errors.rack ? 'error' : ''}`}
        >
          <option value="">Select Rack</option>
          {racks.map((rack) => (
            <option key={rack} value={rack}>{rack}</option>
          ))}
        </select>
        {errors.rack && <span className="error-text">{errors.rack}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Purpose of File</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="form-input"
          placeholder="Brief purpose"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Brief Description / Content</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows="4"
          placeholder="Describe file contents..."
        />
      </div>

      {generatedCode && (
        <div className="preview-section">
          <h4>Generated Codes</h4>
          <div className="preview-codes">
            <div className="code-item">
              <strong>File ID:</strong> {generatedCode.fileId}
            </div>
            <div className="code-item">
              <strong>Barcode:</strong> {generatedCode.barcode}
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <div className="action-left">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGeneratePreview}
          >
            Preview Codes
          </button>
          {generatedCode && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={handlePrintLabel}
            >
              <PrintIcon /> Print Label
            </button>
          )}
        </div>
        
        <div className="action-right">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            <CancelIcon /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <SaveIcon /> Create File
          </button>
        </div>
      </div>
    </form>
  );
};

export default FileForm;