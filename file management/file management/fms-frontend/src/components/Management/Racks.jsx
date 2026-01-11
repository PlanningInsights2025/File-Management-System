import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import BusinessIcon from '@mui/icons-material/Business';
import NumbersIcon from '@mui/icons-material/Numbers';
import SearchIcon from '@mui/icons-material/Search';
import '../../styles/management.css';

const Racks = () => {
  const [racks, setRacks] = useState([
    {
      id: 1,
      code: 'A-01',
      company: 'Company A',
      location: 'Main Storage',
      totalShelves: 10,
      usedShelves: 8,
      capacity: '80%',
      status: 'available',
    },
    {
      id: 2,
      code: 'A-02',
      company: 'Company A',
      location: 'Main Storage',
      totalShelves: 10,
      usedShelves: 10,
      capacity: '100%',
      status: 'full',
    },
    {
      id: 3,
      code: 'B-01',
      company: 'Company B',
      location: 'Annex Building',
      totalShelves: 8,
      usedShelves: 5,
      capacity: '62%',
      status: 'available',
    },
    {
      id: 4,
      code: 'C-01',
      company: 'Company C',
      location: 'Floor 3',
      totalShelves: 6,
      usedShelves: 2,
      capacity: '33%',
      status: 'available',
    },
    {
      id: 5,
      code: 'D-01',
      company: 'Company D',
      location: 'Basement',
      totalShelves: 12,
      usedShelves: 3,
      capacity: '25%',
      status: 'available',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRack, setEditingRack] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddRack = () => {
    setShowAddModal(true);
  };

  const handleCreateRack = (data) => {
    const nextId = racks.length ? Math.max(...racks.map(r => r.id)) + 1 : 1;
    const totalShelves = Number(data.totalShelves) || 10;
    const usedShelves = Number(data.initialFiles) || 0;
    const capacityValue = Math.min(100, Math.round((usedShelves / totalShelves) * 100));
    const newRack = {
      id: nextId,
      code: data.code,
      company: data.company,
      location: data.location || '',
      totalShelves,
      usedShelves,
      capacity: `${capacityValue}%`,
      status: capacityValue >= 100 ? 'full' : 'available',
      description: data.description || '',
    };
    setRacks(prev => [newRack, ...prev]);
    setShowAddModal(false);
  };

  const handleEdit = (rack) => {
    setEditingRack(rack);
    setShowEditModal(true);
  };

  const handleDelete = (rack) => {
    if (window.confirm(`Delete rack ${rack.code}? This action cannot be undone.`)) {
      setRacks(prev => prev.filter(r => r.id !== rack.id));
    }
  };

  const handleSaveEdit = (updated) => {
    const totalShelves = Number(updated.totalShelves) || 10;
    const usedShelves = Number(updated.usedShelves) || 0;
    const capacityValue = Math.min(100, Math.round((usedShelves / totalShelves) * 100));
    setRacks(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated, totalShelves, usedShelves, capacity: `${capacityValue}%`, status: capacityValue >= 100 ? 'full' : 'available' } : r));
    setShowEditModal(false);
    setEditingRack(null);
  };

  const filteredRacks = racks.filter(rack =>
    rack.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-content">
      <div className="content-header">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search racks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddRack}>
          <AddIcon /> Add Rack
        </button>
      </div>

      <div className="racks-grid">
        {filteredRacks.map((rack) => (
          <div key={rack.id} className="rack-card">
            <div className="rack-header">
              <div className="rack-icon">
                <StorageIcon />
              </div>
              <div className="rack-info">
                <h3>{rack.code}</h3>
                <span className="rack-company">{rack.company}</span>
              </div>
              <div className="rack-actions">
                <button className="btn-icon" onClick={() => handleEdit(rack)} title="Edit">
                  <EditIcon />
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(rack)} title="Delete">
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className="rack-details">
              <div className="detail-item">
                <BusinessIcon />
                <span>{rack.location}</span>
              </div>
            </div>

            <div className="rack-stats">
              <div className="stat">
                <span className="stat-label">Shelves</span>
                <span className="stat-value">
                  {rack.usedShelves}/{rack.totalShelves}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Capacity</span>
                <span className="stat-value">{rack.capacity}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Status</span>
                <span className={`status-badge ${rack.status}`}>
                  {rack.status}
                </span>
              </div>
            </div>

            <div className="rack-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: rack.capacity }}
                ></div>
              </div>
              <span>{rack.capacity} filled</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RackForm onCancel={() => setShowAddModal(false)} onCreate={handleCreateRack} />
          </div>
        </div>
      )}

      {showEditModal && editingRack && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Rack</h3>
              <button className="modal-close" onClick={() => { setShowEditModal(false); setEditingRack(null); }}>×</button>
            </div>
            <EditRackForm rack={editingRack} onCancel={() => { setShowEditModal(false); setEditingRack(null); }} onSave={handleSaveEdit} />
          </div>
        </div>
      )}
    </div>
  );
};

const RackForm = ({ onCancel, onCreate }) => {
  const [formData, setFormData] = useState({
    code: '',
    company: '',
    location: '',
    totalShelves: 10,
    description: '',
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
    <form onSubmit={handleSubmit} className="rack-form">
      <div className="modal-header">
        <h3 className="modal-title">Add New Rack</h3>
        <button
          className="modal-close"
          onClick={onCancel}
        >
          ×
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Rack Code *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., A-01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company *</label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Company</option>
            <option value="company-a">Company A</option>
            <option value="company-b">Company B</option>
            <option value="company-c">Company C</option>
            <option value="company-d">Company D</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Location *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g., Main Storage, Floor 3"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Total Shelves</label>
          <input
            type="number"
            name="totalShelves"
            value={formData.totalShelves}
            onChange={handleChange}
            className="form-input"
            min="1"
            max="50"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Initial Files</label>
          <input
            type="number"
            name="initialFiles"
            className="form-input"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows="3"
          placeholder="Additional details about the rack..."
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
          Create Rack
        </button>
      </div>
    </form>
  );
};

export default Racks;

const EditRackForm = ({ rack, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    id: rack.id,
    code: rack.code || '',
    company: rack.company || '',
    location: rack.location || '',
    totalShelves: rack.totalShelves || 10,
    usedShelves: rack.usedShelves || 0,
    description: rack.description || '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="rack-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Rack Code *</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Company *</label>
          <select name="company" value={formData.company} onChange={handleChange} className="form-select" required>
            <option value="">Select Company</option>
            <option value="Company A">Company A</option>
            <option value="Company B">Company B</option>
            <option value="Company C">Company C</option>
            <option value="Company D">Company D</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Location *</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Total Shelves</label>
          <input type="number" name="totalShelves" value={formData.totalShelves} onChange={handleChange} className="form-input" min="1" />
        </div>

        <div className="form-group">
          <label className="form-label">Used Shelves</label>
          <input type="number" name="usedShelves" value={formData.usedShelves} onChange={handleChange} className="form-input" min="0" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" rows="3" />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </div>
    </form>
  );
};