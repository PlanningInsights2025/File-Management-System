import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import FlagIcon from '@mui/icons-material/Flag';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import DraftsIcon from '@mui/icons-material/Drafts';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import InfoIcon from '@mui/icons-material/Info';
import '../styles/createFile.css';
import Barcode from 'react-barcode';

const CreateFilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [savedFileData, setSavedFileData] = useState(null);
  
  const [formData, setFormData] = useState({
    fileName: '',
    company: '',
    department: '',
    location: '',
    description: '',
    category: '',
    priority: '',
    status: 'Active',
    createdBy: 'Admin User',
    createdDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [barcodeValue, setBarcodeValue] = useState(generateBarcodeValue());

  function generateBarcodeValue() {
    const prefix = 'FMS';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fileName.trim()) newErrors.fileName = 'File name is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg', 'image/png', 'image/jpg'];
    
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds maximum size of 10MB`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      id: Math.random().toString(36).substr(2, 9)
    }))]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleGenerateNewBarcode = () => {
    setBarcodeValue(generateBarcodeValue());
  };

  const handlePrintBarcode = () => {
    // Navigate to print preview page with file data
    navigate('/print-preview', {
      state: {
        fileData: {
          barcodeValue: barcodeValue,
          fileName: formData.fileName,
          company: formData.company,
          department: formData.department,
          createdBy: formData.createdBy,
          location: formData.location,
          createdDate: formData.createdDate,
          purpose: formData.purpose
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const fileData = {
        ...formData,
        id: barcodeValue,
        barcode: barcodeValue,
        barcodeValue: barcodeValue,
        files: uploadedFiles,
        createdAt: new Date().toISOString(),
      };
      
      console.log('File created:', fileData);
      setLoading(false);
      setShowSuccess(true);
      setSavedFileData(fileData);
      
      // Show barcode section after brief delay
      setTimeout(() => {
        setShowBarcode(true);
        // Scroll to barcode section
        setTimeout(() => {
          document.getElementById('barcode-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }, 1000);
    }, 1500);
  };

  const handleSaveAsDraft = () => {
    const draftData = {
      ...formData,
      status: 'Draft',
      savedAt: new Date().toISOString(),
    };
    console.log('Saved as draft:', draftData);
    alert('File saved as draft successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/dashboard');
    }
  };

  const handleCreateAnother = () => {
    // Reset all states
    setShowBarcode(false);
    setSavedFileData(null);
    setShowSuccess(false);
    setUploadedFiles([]);
    setFormData({
      fileName: '',
      company: '',
      department: '',
      location: '',
      description: '',
      category: '',
      priority: '',
      status: 'Active',
      createdBy: 'Admin User',
      createdDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setBarcodeValue(generateBarcodeValue());
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="create-file-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">
            <DescriptionIcon />
          </div>
          <div className="hero-content">
            <h1>Create New File</h1>
            <p>Create and manage digital files with automatic barcode generation</p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="success-message">
            <InfoIcon />
            <span>File created successfully! Barcode generated below.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-file-form">
          {/* Card 1: Company Details */}
          <div className="form-card">
            <div className="card-header">
              <BusinessIcon className="card-icon" />
              <h2>Company Details</h2>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Select Company <span className="required">*</span>
                  </label>
                  <div className="select-with-add">
                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={errors.company ? 'error' : ''}
                      disabled={showBarcode}
                    >
                      <option value="">-- Select Company --</option>
                      <option value="Tech Corp">Tech Corp</option>
                      <option value="Global Industries">Global Industries</option>
                      <option value="Innovate Solutions">Innovate Solutions</option>
                      <option value="Enterprise LLC">Enterprise LLC</option>
                    </select>
                    <button type="button" className="add-btn" title="Add new company">+</button>
                  </div>
                  {errors.company && <span className="error-text">{errors.company}</span>}
                </div>

                <div className="form-field">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={errors.department ? 'error' : ''}
                    disabled={showBarcode}
                  >
                    <option value="">-- Select Department --</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">Information Technology</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales & Marketing</option>
                    <option value="Legal">Legal</option>
                  </select>
                  {errors.department && <span className="error-text">{errors.department}</span>}
                </div>
              </div>
              <p className="help-text">Don't see your company? Click + to add a new one.</p>
            </div>
          </div>

          {/* Card 2: File Details */}
          <div className="form-card">
            <div className="card-header">
              <DescriptionIcon className="card-icon" />
              <h2>File Details</h2>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    File Title/Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fileName"
                    value={formData.fileName}
                    onChange={handleChange}
                    placeholder="Enter file title"
                    className={errors.fileName ? 'error' : ''}
                    disabled={showBarcode}
                  />
                  {errors.fileName && <span className="error-text">{errors.fileName}</span>}
                </div>

                <div className="form-field">
                  <label>Brief description of file contents</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of file contents"
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Prepared By <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleChange}
                    placeholder="Enter preparer name"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Responsible Person (Owner) <span className="required">*</span>
                  </label>
                  <select name="responsiblePerson" onChange={handleChange}>
                    <option value="">-- Select Responsible Person --</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                  </select>
                </div>
              </div>

              <div className="form-field-full">
                <label>Purpose of File</label>
                <textarea
                  name="purpose"
                  onChange={handleChange}
                  placeholder="Describe the purpose"
                  rows="3"
                />
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Rack/Shelf Location <span className="required">*</span>
                  </label>
                  <select name="location" value={formData.location} onChange={handleChange}>
                    <option value="">-- Select Rack Location --</option>
                    <option value="Rack A-01">Rack A-01</option>
                    <option value="Rack A-02">Rack A-02</option>
                    <option value="Rack B-01">Rack B-01</option>
                    <option value="Rack B-02">Rack B-02</option>
                    <option value="Rack C-01">Rack C-01</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    File Category <span className="required">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Legal">Legal</option>
                    <option value="Financial">Financial</option>
                    <option value="HR">Human Resources</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Technical">Technical</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Priority Level <span className="required">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={errors.priority ? 'error' : ''}
                  >
                    <option value="">-- Select Priority --</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  {errors.priority && <span className="error-text">{errors.priority}</span>}
                </div>

                <div className="form-field">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Archived">Archived</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>Created Date</label>
                  <input
                    type="date"
                    name="createdDate"
                    value={formData.createdDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Document Upload */}
          <div className="form-card">
            <div className="card-header">
              <UploadFileIcon className="card-icon" />
              <h2>Document Upload</h2>
            </div>
            <div className="card-body">
              <div
                className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon className="upload-icon" />
                <h3>Drag and drop files here</h3>
                <p>or click to browse</p>
                <p className="upload-info">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB per file)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="uploaded-files-list">
                  <h3>Uploaded Files ({uploadedFiles.length})</h3>
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="file-item">
                      <DescriptionIcon className="file-icon" />
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{file.size}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => removeFile(file.id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Barcode Generation - Only shown after file is saved */}
          {showBarcode && (
          <div className="form-card" id="barcode-section">
            <div className="card-header">
              <QrCode2Icon className="card-icon" />
              <h2>Barcode Generation</h2>
            </div>
            <div className="card-body">
              <div className="barcode-container">
                <div className="barcode-preview-section">
                  <div className="barcode-display" id="barcode-print-area">
                    {/* Page 1: Barcode Label */}
                    <div className="print-page barcode-label-page">
                      <div className="print-header">
                        <h3>File Label - Print and Attach to Physical File</h3>
                        <div className="cut-line">✂ Cut Here ✂</div>
                      </div>
                      
                      <div className="label-content">
                        <div className="label-left">
                          <h4>File Information</h4>
                          <table className="file-info-table">
                            <tbody>
                              <tr>
                                <td className="label-cell">File ID:</td>
                                <td className="value-cell">{barcodeValue}</td>
                              </tr>
                              <tr>
                                <td className="label-cell">File Name:</td>
                                <td className="value-cell">{formData.fileName || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="label-cell">Company:</td>
                                <td className="value-cell">{formData.company || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="label-cell">Department:</td>
                                <td className="value-cell">{formData.department || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="label-cell">Created By:</td>
                                <td className="value-cell">{formData.createdBy || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="label-cell">File Location:</td>
                                <td className="value-cell">{formData.location || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="label-cell">Created Date:</td>
                                <td className="value-cell">
                                  {formData.createdDate ? new Date(formData.createdDate).toLocaleDateString('en-GB') : 'N/A'}
                                </td>
                              </tr>
                              <tr>
                                <td className="label-cell">Purpose:</td>
                                <td className="value-cell">{formData.purpose || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="label-right">
                          <div className="barcode-wrapper">
                            <Barcode
                              value={barcodeValue}
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
                        <div className="index-barcode">
                          <Barcode
                            value={barcodeValue}
                            format="CODE128"
                            width={1.5}
                            height={60}
                            displayValue={true}
                            fontSize={12}
                            margin={5}
                          />
                          <p className="file-number">File No: {barcodeValue}</p>
                        </div>
                      </div>

                      <div className="index-contents">
                        <h3>TABLE OF CONTENTS</h3>
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
                            {Array.from({ length: 20 }, (_, i) => (
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
                            <span className="sig-value">{formData.createdBy || '_________________'}</span>
                          </div>
                          <div className="signature-field">
                            <span className="sig-label">Date:</span>
                            <span className="sig-value">
                              {formData.createdDate ? new Date(formData.createdDate).toLocaleDateString('en-GB') : '__________'}
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
                
                <div className="barcode-actions no-print">
                  <button
                    type="button"
                    className="btn-barcode"
                    onClick={handleGenerateNewBarcode}
                  >
                    <RefreshIcon /> Generate New Barcode
                  </button>
                  <button
                    type="button"
                    className="btn-barcode btn-print"
                    onClick={handlePrintBarcode}
                  >
                    <PrintIcon /> Print Label & Index Page
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Information Box */}
          <div className="info-box">
            <InfoIcon className="info-icon" />
            <div className="info-content">
              <h3>After submission, system will generate:</h3>
              <ul>
                <li>
                  <DescriptionIcon /> Unique File ID
                </li>
                <li>
                  <QrCode2Icon /> QR Code for file tracking
                </li>
                <li>
                  <PrintIcon /> Printable barcode label
                </li>
                <li>
                  <DescriptionIcon /> Index page for file
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {!showBarcode ? (
              <>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <div className="buttons-right">
                  <button
                    type="button"
                    className="btn-draft"
                    onClick={handleSaveAsDraft}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="btn-create"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span> Creating...
                      </>
                    ) : (
                      'Create File'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate('/files')}
                >
                  Go to File List
                </button>
                <div className="buttons-right">
                  <button
                    type="button"
                    className="btn-create"
                    onClick={handleCreateAnother}
                  >
                    <RefreshIcon /> Create Another File
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateFilePage;
