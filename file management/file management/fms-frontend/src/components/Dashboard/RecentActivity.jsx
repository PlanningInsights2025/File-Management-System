import React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import '../../styles/dashboard.css';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      fileId: 'FMS-1024',
      fileName: 'Annual Budget 2024',
      action: 'OUT',
      user: 'John Doe',
      time: '10:30 AM',
      date: 'Today',
      icon: <ArrowUpwardIcon />,
      color: '#e74c3c'
    },
    {
      id: 2,
      fileId: 'FMS-2048',
      fileName: 'Employee Contracts',
      action: 'IN',
      user: 'Jane Smith',
      time: '09:45 AM',
      date: 'Today',
      icon: <ArrowDownwardIcon />,
      color: '#2ecc71'
    },
    {
      id: 3,
      fileId: 'FMS-3072',
      fileName: 'Client Agreements',
      action: 'TRANSFER',
      user: 'Bob Wilson',
      time: 'Yesterday',
      date: '3:15 PM',
      icon: <SwapHorizIcon />,
      color: '#f39c12'
    },
    {
      id: 4,
      fileId: 'FMS-4096',
      fileName: 'Audit Reports',
      action: 'OUT',
      user: 'Alice Brown',
      time: '2 days ago',
      date: '11:20 AM',
      icon: <ArrowUpwardIcon />,
      color: '#e74c3c'
    },
    {
      id: 5,
      fileId: 'FMS-5120',
      fileName: 'Project Documentation',
      action: 'IN',
      user: 'Charlie Davis',
      time: '3 days ago',
      date: '4:45 PM',
      icon: <ArrowDownwardIcon />,
      color: '#2ecc71'
    },
  ];

  return (
    <div className="card">
      <h3>Recent File Activities</h3>
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon" style={{ backgroundColor: activity.color + '20', color: activity.color }}>
              {activity.icon}
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <span className="file-id">{activity.fileId}</span>
                <span className={`action-badge ${activity.action.toLowerCase()}`}>
                  {activity.action}
                </span>
              </div>
              <p className="file-name">{activity.fileName}</p>
              <div className="activity-footer">
                <span className="user">{activity.user}</span>
                <span className="time">{activity.date} • {activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;