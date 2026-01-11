import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getLS, setLS } from '../../utils/helpers';
import '../../styles/management.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getLS('users', [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', department: 'IT', companyId: 1, status: 'ACTIVE' },
      { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Manager', department: 'HR', companyId: 1, status: 'ACTIVE' },
    ]);
    setUsers(stored);
  }, []);

  // Save to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      setLS('users', users);
    }
  }, [users]);

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted!');
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u
    ));
    toast.success('Status updated!');
  };

  const handleSave = (formData) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      toast.success('User updated!');
    } else {
      const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers(prev => [...prev, { id: newId, ...formData, status: 'ACTIVE' }]);
      toast.success('User added!');
    }
    setShowModal(false);
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="header-left">
          <h2>👥 Users</h2>
          <span className="count-badge">{filteredUsers.length} users</span>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by name, email, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            ➕ Add User
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Company ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td><span className="badge">{user.role}</span></td>
                <td>{user.department}</td>
                <td>{user.companyId}</td>
                <td>
                  <button
                    className={`status-toggle ${user.status.toLowerCase()}`}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status}
                  </button>
                </td>
                <td className="actions">
                  <button className="btn-icon edit" onClick={() => handleEdit(user)}>✏️</button>
                  <button className="btn-icon delete" onClick={() => handleDelete(user.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'User',
    department: user?.department || '',
    companyId: user?.companyId || 1,
    status: user?.status || 'ACTIVE',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? 'Edit User' : 'Add User'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>User</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., IT"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Company ID</label>
              <input
                type="number"
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {user ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Users;
