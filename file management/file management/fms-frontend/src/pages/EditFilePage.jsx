import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import '../styles/createFile.css';

const EditFilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to get file data from navigation state, fallback to fetch logic if needed
    if (location.state && location.state.fileData) {
      setFormData(location.state.fileData);
    } else {
      // TODO: fetch file data by id from backend if needed
      setFormData({});
    }
  }, [location.state, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Save updated file data to backend
    setTimeout(() => {
      setLoading(false);
      alert('File updated!');
      navigate('/files');
    }, 800);
  };

  return (
    <Layout>
      <div className="create-file-page">
        <h2>Edit File</h2>
        <form className="file-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>File Name</label>
            <input
              type="text"
              name="fileName"
              value={formData.fileName || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Responsible Person</label>
            <input
              type="text"
              name="responsiblePerson"
              value={formData.responsiblePerson || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Rack Location</label>
            <input
              type="text"
              name="rackLocation"
              value={formData.rackLocation || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/files')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditFilePage;
