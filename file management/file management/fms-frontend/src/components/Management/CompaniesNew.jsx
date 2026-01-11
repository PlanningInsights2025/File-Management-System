import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getLS, setLS } from '../../utils/helpers';
import '../../styles/management.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getLS('companies', [
      { id: 1, code: 'COMP-A', name: 'Company A' },
      { id: 2, code: 'COMP-B', name: 'Company B' },
    ]);
    setCompanies(stored);
  }, []);

  // Save to localStorage whenever companies change
  useEffect(() => {
    if (companies.length > 0) {
      setLS('companies', companies);
    }
  }, [companies]);

  const handleAdd = () => {
    setEditingCompany(null);
    setShowModal(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this company?')) {
      setCompanies(prev => prev.filter(c => c.id !== id));
      toast.success('Company deleted!');
    }
  };

  const handleSave = (formData) => {
    if (editingCompany) {
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...formData } : c));
      toast.success('Company updated!');
    } else {
      const newId = companies.length ? Math.max(...companies.map(c => c.id)) + 1 : 1;
      setCompanies(prev => [...prev, { id: newId, ...formData }]);
      toast.success('Company added!');
    }
    setShowModal(false);
  };

  const filteredCompanies = companies.filter(c =>
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="header-left">
          <h2>🏢 Companies</h2>
          <span className="count-badge">{filteredCompanies.length} companies</span>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            ➕ Add Company
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company, index) => (
              <tr key={company.id}>
                <td>{index + 1}</td>
                <td><strong>{company.code}</strong></td>
                <td>{company.name}</td>
                <td className="actions">
                  <button className="btn-icon edit" onClick={() => handleEdit(company)}>✏️</button>
                  <button className="btn-icon delete" onClick={() => handleDelete(company.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CompanyModal
          company={editingCompany}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const CompanyModal = ({ company, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: company?.code || '',
    name: company?.name || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Code and Name are required!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{company ? 'Edit Company' : 'Add Company'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Company Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., COMP-A"
                required
              />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {company ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Companies;
