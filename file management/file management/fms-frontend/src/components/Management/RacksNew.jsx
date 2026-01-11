import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getLS, setLS } from '../../utils/helpers';
import '../../styles/management.css';

const Racks = () => {
  const [racks, setRacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRack, setEditingRack] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getLS('racks', [
      { id: 1, code: 'A-01', location: 'Main Storage' },
      { id: 2, code: 'B-01', location: 'Annex Building' },
    ]);
    setRacks(stored);
  }, []);

  // Save to localStorage whenever racks change
  useEffect(() => {
    if (racks.length > 0) {
      setLS('racks', racks);
    }
  }, [racks]);

  const handleAdd = () => {
    setEditingRack(null);
    setShowModal(true);
  };

  const handleEdit = (rack) => {
    setEditingRack(rack);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this rack?')) {
      setRacks(prev => prev.filter(r => r.id !== id));
      toast.success('Rack deleted!');
    }
  };

  const handleSave = (formData) => {
    if (editingRack) {
      setRacks(prev => prev.map(r => r.id === editingRack.id ? { ...r, ...formData } : r));
      toast.success('Rack updated!');
    } else {
      const newId = racks.length ? Math.max(...racks.map(r => r.id)) + 1 : 1;
      setRacks(prev => [...prev, { id: newId, ...formData }]);
      toast.success('Rack added!');
    }
    setShowModal(false);
  };

  const filteredRacks = racks.filter(r =>
    r.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="header-left">
          <h2>📦 Racks</h2>
          <span className="count-badge">{filteredRacks.length} racks</span>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by code or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            ➕ Add Rack
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRacks.map((rack, index) => (
              <tr key={rack.id}>
                <td>{index + 1}</td>
                <td><strong>{rack.code}</strong></td>
                <td>{rack.location}</td>
                <td className="actions">
                  <button className="btn-icon edit" onClick={() => handleEdit(rack)}>✏️</button>
                  <button className="btn-icon delete" onClick={() => handleDelete(rack.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <RackModal
          rack={editingRack}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const RackModal = ({ rack, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: rack?.code || '',
    location: rack?.location || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.location.trim()) {
      toast.error('Code and Location are required!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{rack ? 'Edit Rack' : 'Add Rack'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Rack Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., A-01"
                required
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {rack ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Racks;
