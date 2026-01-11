import React from 'react';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import FolderIcon from '@mui/icons-material/Folder';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const [stats, setStats] = React.useState({
    totalFiles: 0,
    filesOut: 0,
    overdueFiles: 0,
    totalUsers: 0,
    totalCompanies: 0,
    totalRacks: 0,
  });

  React.useEffect(() => {
    // Mock data - replace with actual Firebase data
    setStats({
      totalFiles: 1247,
      filesOut: 342,
      overdueFiles: 23,
      totalUsers: 48,
      totalCompanies: 6,
      totalRacks: 42,
    });
  }, []);

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Dashboard Overview</h2>
          <div className="date-range">
            <span>Last 30 days</span>
          </div>
        </div>

        <div className="stats-grid">
          <StatsCard
            title="Total Files"
            value={stats.totalFiles}
            icon={<FolderIcon />}
            color="#3498db"
            trend="+12%"
          />
          <StatsCard
            title="Files OUT"
            value={stats.filesOut}
            icon={<QrCodeIcon />}
            color="#e74c3c"
            trend="-5%"
          />
          <StatsCard
            title="Overdue Files"
            value={stats.overdueFiles}
            icon={<WarningIcon />}
            color="#f39c12"
            trend="+2"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="#2ecc71"
            trend="+3"
          />
          <StatsCard
            title="Companies"
            value={stats.totalCompanies}
            icon={<BusinessIcon />}
            color="#9b59b6"
            trend="+1"
          />
          <StatsCard
            title="Racks"
            value={stats.totalRacks}
            icon={<TrendingUpIcon />}
            color="#1abc9c"
            trend="+4"
          />
        </div>

        <div className="dashboard-content">
          <div className="content-left">
            <RecentActivity />
          </div>
          
          <div className="content-right">
            <div className="card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="btn btn-primary">
                  <FolderIcon /> Create New File
                </button>
                <button className="btn btn-success">
                  <QrCodeIcon /> Generate Barcode
                </button>
                <button className="btn btn-warning">
                  <PeopleIcon /> Add New User
                </button>
                <button className="btn btn-secondary">
                  <BusinessIcon /> Add Company
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Recent Alerts</h3>
              <div className="alerts-list">
                <div className="alert-item">
                  <div className="alert-icon danger">
                    <WarningIcon />
                  </div>
                  <div className="alert-content">
                    <p>File FMS-1024 is overdue by 3 days</p>
                    <span className="alert-time">2 hours ago</span>
                  </div>
                </div>
                <div className="alert-item">
                  <div className="alert-icon warning">
                    <WarningIcon />
                  </div>
                  <div className="alert-content">
                    <p>Rack A-12 is 85% full</p>
                    <span className="alert-time">1 day ago</span>
                  </div>
                </div>
                <div className="alert-item">
                  <div className="alert-icon info">
                    <FolderIcon />
                  </div>
                  <div className="alert-content">
                    <p>File FMS-2048 has been OUT for 7 days</p>
                    <span className="alert-time">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;