import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import SearchIcon from '@mui/icons-material/Search';
import '../../styles/management.css';

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'System Admin',
      company: 'All',
      department: 'Administration',
      status: 'active',
      lastLogin: '2024-01-23 10:30',
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'File Manager',
      company: 'Company A',
      department: 'HR',
      status: 'active',
      lastLogin: '2024-01-22 15:45',
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'Employee',
      company: 'Company B',
      department: 'Finance',
      status: 'active',
      lastLogin: '2024-01-21 09:20',
    },
    {
      id: 4,
      name: 'Bob Wilson',
      email: 'bob@company.com',
      role: 'Auditor',
      company: 'Company C',
      department: 'Audit',
      status: 'inactive',
      lastLogin: '2024-01-15 14:10',
    },
    {
      id: 5,
      name: 'Alice Brown',
      email: 'alice@company.com',
      role: 'Manager',
      company: 'Company A',
      department: 'Operations',
      status: 'active',
      lastLogin: '2024-01-23 08:45',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleCreateUser = (data) => {
    const nextId = users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      name: data.name,
      email: data.email,
      role: data.role || 'Employee',
      company: data.company || '',
      department: data.department || '',
      status: 'active',
      lastLogin: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [newUser, ...prev]);
    setShowAddModal(false);
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const handleResetPassword = (user) => {
    const pw = window.prompt(`Enter a new password for ${user.name}`, '');
    if (pw === null) return; // cancelled
    if (!pw) return alert('Password cannot be empty');
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: pw } : u));
    alert(`Password for ${user.name} has been reset.`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-content">
      <div className="content-header">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <AddIcon /> Add User
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-details">
                      <strong>{user.name}</strong>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase().replace(' ', '-')}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.company}</td>
                <td>{user.department}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(user)}
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleResetPassword(user)}
                      title="Reset Password"
                    >
                      <LockResetIcon />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(user)}
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
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New User</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
              <UserForm onCancel={() => setShowAddModal(false)} onCreate={handleCreateUser} />
          </div>
        </div>
      )}

        {showEditModal && editingUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Edit User</h3>
                <button
                  className="modal-close"
                  onClick={() => { setShowEditModal(false); setEditingUser(null); }}
                >
                  ×
                </button>
              </div>
              <EditUserForm
                user={editingUser}
                onCancel={() => { setShowEditModal(false); setEditingUser(null); }}
                onSave={(updated) => {
                  setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

const UserForm = ({ onCancel, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    company: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match');
    }
    const payload = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      company: formData.company,
      department: formData.department,
    };
    if (onCreate) onCreate(payload);
    onCancel();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="user@company.com"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="employee">Employee</option>
            <option value="file-manager">File Manager</option>
            <option value="manager">Manager</option>
            <option value="auditor">Auditor</option>
            <option value="system-admin">System Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Company</label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Company</option>
            <option value="company-a">Company A</option>
            <option value="company-b">Company B</option>
            <option value="company-c">Company C</option>
            <option value="all">All Companies</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter department"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            placeholder="Confirm password"
            required
          />
        </div>
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
          Create User
        </button>
      </div>
    </form>
  );
};

  const EditUserForm = ({ user, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role ? user.role.toLowerCase() : 'employee',
      company: user.company || '',
      department: user.department || '',
      status: user.status || 'active',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSave) onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="employee">Employee</option>
              <option value="file-manager">File Manager</option>
              <option value="manager">Manager</option>
              <option value="auditor">Auditor</option>
              <option value="system-admin">System Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Company</option>
              <option value="company-a">Company A</option>
              <option value="company-b">Company B</option>
              <option value="company-c">Company C</option>
              <option value="all">All Companies</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-input"
          />
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

  export default Users;