import React from 'react';
import '../../styles/dashboard.css';

const StatsCard = ({ title, value, icon, color, trend }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-header">
        <div className="stats-icon" style={{ backgroundColor: color + '20', color: color }}>
          {icon}
        </div>
        <div className="stats-trend">
          <span className={`trend ${trend.startsWith('+') ? 'up' : 'down'}`}>
            {trend}
          </span>
        </div>
      </div>
      <div className="stats-content">
        <h3>{value.toLocaleString()}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;