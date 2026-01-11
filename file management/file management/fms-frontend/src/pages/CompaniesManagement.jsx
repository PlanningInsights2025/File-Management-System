import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import Modal from '../components/Common/Modal';
import { toast } from 'react-toastify';
import '../styles/management.css';

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: 'ABC Corporation', contactPerson: 'Michael Brown', email: 'michael@abc.com', phone: '555-1234', address: '123 Main St', city: 'New York', state: 'NY', status: 'Active' },
    { id: 2, name: 'XYZ Enterprises', contactPerson: 'Sarah Wilson', email: 'sarah@xyz.com', phone: '555-5678', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', status: 'Active' },
    { id: 3, name: 'Tech Innovators Inc', contactPerson: 'David Lee', email: 'david@tech.com', phone: '555-9012', address: '789 Pine Rd', city: 'Chicago', state: 'IL', status: 'Inactive' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    status: 'Active'
  });

  const handleAddCompany = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setShowModal(true);
  };

  const handleDeleteCompany = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success('Company deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCompany) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? { ...c, ...formData } : c));
      toast.success('Company updated successfully!');
    } else {
      const newCompany = {
        id: companies.length + 1,
        ...formData
      };
      setCompanies([...companies, newCompany]);
      toast.success('Company created successfully!');
    }
    
    setShowModal(false);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="management-page">
        <div className="management-header">
          <div>
            <h1>🏢 Companies Management</h1>
            <p className="subtitle">Manage registered companies and clients</p>
          </div>
          <button className="btn-primary" onClick={handleAddCompany}>
            ➕ Add New Company
          </button>
        </div>

        <div className="management-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td><strong>{company.name}</strong></td>
                  <td>{company.contactPerson}</td>
                  <td>{company.email}</td>
                  <td>{company.phone}</td>
                  <td>{company.city}, {company.state}</td>
                  <td>
                    <span className={`status-badge ${company.status.toLowerCase()}`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-icon edit" onClick={() => handleEditCompany(company)}>
                      ✏️
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeleteCompany(company.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <Modal
            title={editingCompany ? 'Edit Company' : 'Add New Company'}
            onClose={() => setShowModal(false)}
          >
            <form onSubmit={handleSubmit} className="management-form">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCompany ? 'Update Company' : 'Create Company'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default CompaniesManagement;
