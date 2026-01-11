import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import Modal from '../components/Common/Modal';
import { toast } from 'react-toastify';
import '../styles/management.css';

const RacksManagement = () => {
  const [racks, setRacks] = useState([
    { id: 'A-1', location: 'Zone A', capacity: 100, currentFiles: 75, status: 'Available', description: 'Main storage area' },
    { id: 'A-2', location: 'Zone A', capacity: 100, currentFiles: 100, status: 'Full', description: 'Main storage area' },
    { id: 'B-1', location: 'Zone B', capacity: 150, currentFiles: 45, status: 'Available', description: 'Secondary storage' },
    { id: 'B-2', location: 'Zone B', capacity: 150, currentFiles: 120, status: 'Available', description: 'Secondary storage' },
    { id: 'C-1', location: 'Zone C', capacity: 80, currentFiles: 0, status: 'Maintenance', description: 'Archive section' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRack, setEditingRack] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    id: '',
    location: '',
    capacity: '',
    currentFiles: 0,
    status: 'Available',
    description: ''
  });

  const handleAddRack = () => {
    setEditingRack(null);
    setFormData({
      id: '',
      location: '',
      capacity: '',
      currentFiles: 0,
      status: 'Available',
      description: ''
    });
    setShowModal(true);
  };

  const handleEditRack = (rack) => {
    setEditingRack(rack);
    setFormData(rack);
    setShowModal(true);
  };

  const handleDeleteRack = (rackId) => {
    if (window.confirm('Are you sure you want to delete this rack?')) {
      setRacks(racks.filter(r => r.id !== rackId));
      toast.success('Rack deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingRack) {
      setRacks(racks.map(r => r.id === editingRack.id ? { ...formData } : r));
      toast.success('Rack updated successfully!');
    } else {
      if (racks.find(r => r.id === formData.id)) {
        toast.error('Rack ID already exists!');
        return;
      }
      setRacks([...racks, { ...formData, currentFiles: parseInt(formData.currentFiles) || 0 }]);
      toast.success('Rack created successfully!');
    }
    
    setShowModal(false);
  };

  const filteredRacks = filterStatus === 'All' 
    ? racks 
    : racks.filter(rack => rack.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return '#4CAF50';
      case 'Full': return '#F44336';
      case 'Maintenance': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <Layout>
      <div className="management-page">
        <div className="management-header">
          <div>
            <h1>📦 Racks Management</h1>
            <p className="subtitle">Manage storage racks and capacity</p>
          </div>
          <button className="btn-primary" onClick={handleAddRack}>
            ➕ Add New Rack
          </button>
        </div>

        <div className="management-controls">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="racks-grid">
          {filteredRacks.map((rack) => {
            const utilizationPercent = (rack.currentFiles / rack.capacity) * 100;
            return (
              <div key={rack.id} className="rack-card">
                <div className="rack-header">
                  <h3>Rack {rack.id}</h3>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(rack.status) }}
                  >
                    {rack.status}
                  </span>
                </div>
                
                <div className="rack-details">
                  <div className="rack-info">
                    <span className="label">📍 Location:</span>
                    <span className="value">{rack.location}</span>
                  </div>
                  <div className="rack-info">
                    <span className="label">📊 Capacity:</span>
                    <span className="value">{rack.capacity} files</span>
                  </div>
                  <div className="rack-info">
                    <span className="label">📁 Current:</span>
                    <span className="value">{rack.currentFiles} files</span>
                  </div>
                  <div className="rack-info">
                    <span className="label">📝 Description:</span>
                    <span className="value">{rack.description}</span>
                  </div>
                </div>

                <div className="capacity-bar">
                  <div className="capacity-label">
                    <span>Utilization</span>
                    <span className="percentage">{utilizationPercent.toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${utilizationPercent}%`,
                        backgroundColor: utilizationPercent >= 100 ? '#F44336' : 
                                        utilizationPercent >= 80 ? '#FF9800' : '#4CAF50'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="rack-actions">
                  <button className="btn-icon edit" onClick={() => handleEditRack(rack)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDeleteRack(rack.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showModal && (
          <Modal
            title={editingRack ? 'Edit Rack' : 'Add New Rack'}
            onClose={() => setShowModal(false)}
          >
            <form onSubmit={handleSubmit} className="management-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Rack ID *</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g., A-1, B-2"
                    required
                    disabled={!!editingRack}
                  />
                </div>
                <div className="form-group">
                  <label>Location/Zone *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Zone A"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity (number of files) *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Current Files</label>
                  <input
                    type="number"
                    value={formData.currentFiles}
                    onChange={(e) => setFormData({ ...formData, currentFiles: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Full">Full</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Enter rack description..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingRack ? 'Update Rack' : 'Create Rack'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default RacksManagement;
