import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import '../../styles/management.css';

const Companies = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Company A',
      code: 'COMP-A',
      address: '123 Main Street, City',
      contactPerson: 'John Manager',
      email: 'contact@companya.com',
      phone: '+1 234 567 8900',
      totalUsers: 15,
      totalFiles: 420,
      status: 'active',
    },
    {
      id: 2,
      name: 'Company B',
      code: 'COMP-B',
      address: '456 Oak Avenue, Town',
      contactPerson: 'Jane Director',
      email: 'info@companyb.com',
      phone: '+1 234 567 8901',
      totalUsers: 12,
      totalFiles: 380,
      status: 'active',
    },
    {
      id: 3,
      name: 'Company C',
      code: 'COMP-C',
      address: '789 Pine Road, Village',
      contactPerson: 'Bob Head',
      email: 'support@companyc.com',
      phone: '+1 234 567 8902',
      totalUsers: 8,
      totalFiles: 210,
      status: 'active',
    },
    {
      id: 4,
      name: 'Company D',
      code: 'COMP-D',
      address: '321 Maple Lane, District',
      contactPerson: 'Alice Chief',
      email: 'admin@companyd.com',
      phone: '+1 234 567 8903',
      totalUsers: 5,
      totalFiles: 150,
      status: 'inactive',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCompany = () => {
    setShowAddModal(true);
  };

  const handleCreateCompany = (data) => {
    const nextId = companies.length ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    const newCompany = {
      id: nextId,
      name: data.name,
      code: data.code,
      address: data.address || '',
      contactPerson: data.contactPerson || '',
      email: data.email || '',
      phone: data.phone || '',
      totalUsers: 0,
      totalFiles: 0,
      status: 'active',
    };
    setCompanies(prev => [newCompany, ...prev]);
    setShowAddModal(false);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowEditModal(true);
  };

  const handleDelete = (company) => {
    if (window.confirm(`Delete company ${company.name}? This cannot be undone.`)) {
      setCompanies(prev => prev.filter(c => c.id !== company.id));
    }
  };

  const handleSaveEdit = (updated) => {
    setCompanies(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
    setShowEditModal(false);
    setEditingCompany(null);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-content">
      <div className="content-header">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddCompany}>
          <AddIcon /> Add Company
        </button>
      </div>

      <div className="companies-grid">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="company-card">
            <div className="company-header">
              <div className="company-logo">
                {company.name.charAt(0)}
              </div>
              <div className="company-info">
                <h3>{company.name}</h3>
                <span className="company-code">{company.code}</span>
              </div>
              <div className="company-actions">
                <button className="btn-icon" onClick={() => handleEdit(company)} title="Edit">
                  <EditIcon />
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(company)} title="Delete">
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className="company-details">
              <div className="detail-item">
                <LocationOnIcon />
                <span>{company.address}</span>
              </div>
              <div className="detail-item">
                <PeopleIcon />
                <span>{company.contactPerson}</span>
              </div>
            </div>

            <div className="company-stats">
              <div className="stat">
                <span className="stat-label">Users</span>
                <span className="stat-value">{company.totalUsers}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Files</span>
                <span className="stat-value">{company.totalFiles}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Status</span>
                <span className={`status-badge ${company.status}`}>
                  {company.status}
                </span>
              </div>
            </div>

            <div className="company-contact">
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <span>{company.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CompanyForm onCancel={() => setShowAddModal(false)} onCreate={handleCreateCompany} />
          </div>
        </div>
      )}

      {showEditModal && editingCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Company</h3>
              <button className="modal-close" onClick={() => { setShowEditModal(false); setEditingCompany(null); }}>×</button>
            </div>
            <EditCompanyForm company={editingCompany} onCancel={() => { setShowEditModal(false); setEditingCompany(null); }} onSave={handleSaveEdit} />
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyForm = ({ onCancel, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCreate) onCreate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
      <div className="modal-header">
        <h3 className="modal-title">Add New Company</h3>
        <button
          className="modal-close"
          onClick={onCancel}
        >
          ×
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Company Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Company Code *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., COMP-A"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Person *</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter contact person"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="company@email.com"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input"
          placeholder="+1 234 567 8900"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="form-textarea"
          rows="3"
          placeholder="Enter company address"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Create Company
        </button>
      </div>
    </form>
  );
};

export default Companies;

const EditCompanyForm = ({ company, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    id: company.id,
    name: company.name || '',
    code: company.code || '',
    address: company.address || '',
    contactPerson: company.contactPerson || '',
    email: company.email || '',
    phone: company.phone || '',
    status: company.status || 'active',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
      <div className="form-group">
        <label className="form-label">Company Name *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Company Code *</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Person *</label>
          <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea name="address" value={formData.address} onChange={handleChange} className="form-textarea" rows="3" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="form-select">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </div>
    </form>
  );
};