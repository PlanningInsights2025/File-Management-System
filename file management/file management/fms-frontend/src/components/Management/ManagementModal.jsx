import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ManagementModal = ({ type, item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
  }, [item, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getTitle = () => {
    if (type === 'add-user') return 'Add New User';
    if (type === 'edit-user') return 'Edit User';
    if (type === 'add-company') return 'Add New Company';
    if (type === 'edit-company') return 'Edit Company';
    if (type === 'add-rack') return 'Add New Rack';
    if (type === 'edit-rack') return 'Edit Rack';
    return 'Modal';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* USER FORM */}
            {type?.includes('user') && (
              <>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                {type === 'add-user' && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Role *</label>
                  <select name="role" value={formData.role || ''} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select name="department" value={formData.department || ''} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={formData.status || 'Active'} onChange={handleChange} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {/* COMPANY FORM */}
            {type?.includes('company') && (
              <>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={formData.status || 'Active'} onChange={handleChange} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {/* RACK FORM */}
            {type?.includes('rack') && (
              <>
                <div className="form-group">
                  <label>Rack ID *</label>
                  <input
                    type="text"
                    name="rackId"
                    value={formData.rackId || ''}
                    onChange={handleChange}
                    required
                    disabled={type === 'edit-rack'}
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity || ''}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Current Files *</label>
                  <input
                    type="number"
                    name="currentFiles"
                    value={formData.currentFiles || 0}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={formData.status || 'Available'} onChange={handleChange} required>
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {type?.startsWith('add') ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagementModal;
