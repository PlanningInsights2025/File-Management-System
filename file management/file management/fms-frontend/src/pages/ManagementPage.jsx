import React, { useState, useContext } from 'react';
import Layout from '../components/Layout/Layout';
import Companies from '../components/Management/Companies';
import Users from '../components/Management/Users';
import Racks from '../components/Management/Racks';
import { UserContext } from '../context/UserContext';
import '../styles/management.css';

const ManagementPage = () => {
  const { userData } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('users');

  // Role guard - only Admin can access
  if (userData?.role !== 'System Admin' && userData?.role !== 'Admin') {
    return (
      <Layout>
        <div className="access-denied">
          <h2>⛔ Access Denied</h2>
          <p>You don't have permission to access this page. Only administrators can manage users, companies, and racks.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="management-page">
        <div className="management-header">
          <h1>⚙️ System Management</h1>
          <p className="subtitle">Manage users, companies, and rack locations</p>
        </div>

        {/* Tab Navigation */}
        <div className="management-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            🏢 Companies
          </button>
          <button 
            className={`tab-btn ${activeTab === 'racks' ? 'active' : ''}`}
            onClick={() => setActiveTab('racks')}
          >
            📦 Racks
          </button>
        </div>

        {/* Tab Content */}
        <div className="management-content">
          {activeTab === 'users' && <Users />}
          {activeTab === 'companies' && <Companies />}
          {activeTab === 'racks' && <Racks />}
        </div>
      </div>
    </Layout>
  );
};

export default ManagementPage;
